const request = require('request-promise');
const cheerio = require('cheerio');
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
  if (!databases[db])
    throw `unknown database ${db}`;

  return `${databases[db].url}/${key}`;
}

async function fetchRecord(url) {
  let $;
  try {
    $ = cheerio.load(await request(url));
  } catch (e) {
    if (e.name === 'StatusCodeError')
      throw `request failed with code ${e.statusCode}`;
    else
      throw e;
  }
  return $('#bibtex-section > pre').text();
}
