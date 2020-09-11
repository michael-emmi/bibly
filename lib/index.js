const request = require('request-promise');
const cp = require('child_process');
const fs = require('fs-extra');
const debug = require('debug')('bibly');

exports.getEntries = getEntries;
exports.getRecord = getRecord;

function getEntries(latexSource, databases) {
  const dbExpr = `^(${Object.keys(databases).join('|')}):`;
  return new Promise((resolve, reject) => {
    try {
      let tempDir = `bibly-output`;
      fs.ensureDirSync(tempDir);
      let latex = cp.spawnSync('latex', [
        '-interaction', 'nonstopmode',
        '-jobname', 'bibly',
        '-output-directory', tempDir,
        latexSource
      ]);
      fs.removeSync(tempDir);
      let entries = latex.stdout.toString()
        .split("\n")
        .filter(line => line.match(/Citation/))
        .map(line => line.match(/`(.*)'/)[1])
        .filter(entry => entry.match(dbExpr));
      entries = [...new Set(entries)];
      debug(`got entries: ${entries}`);
      resolve(entries);

    } catch (e) {
      reject(e);
    }
  });
}

async function getRecord(entry, databases) {
  try {
    debug(`fetching: ${entry}`);

    let {db, key} = unpackEntry(entry);
    debug(`database: ${db}`);
    debug(`key: ${key}`);

    let url = composeUrl(db, key, databases);
    debug(`url: ${url}`);

    let record = await fetchRecord(url);
    debug(`record: ${record}`);

    return {
      key: entry,
      db: db,
      record: record
    };
  } catch (e) {
    return {
      key: entry,
      error: e
    };
  }
}

function unpackEntry(entry) {
  let m = entry.match(/^(\w*):(.*)$/);
  if (!m)
    throw `unknown entry format: ${entry}`;
  return {
    db: m[1] || '',
    key: m[2] || ''
  };
}

function composeUrl(db, key, databases) {
  const database = databases[db];

  if (!database)
    throw `unknown database ${db}`;

  let url = `${database.url}/${key}`;

  if (database.suffix) {
    url = `${url}${database.suffix}`;
  }

  if (database.parameters) {
    const query = Object.entries(database.parameters).map(([k,v]) => `${k}=${v}`).join('&');
    url = `${url}?${query}`;
  }

  return url;
}

async function fetchRecord(url) {

  try {
    return await request(url);
  } catch (e) {
    if (e.name === 'StatusCodeError')
      throw `request failed with code ${e.statusCode}`;
    else
      throw e;
  }
}
