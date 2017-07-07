const request = require('request-promise');
const cheerio = require('cheerio');
const cp = require('child_process');
const fs = require('fs-extra')
const debug = require('debug')('bibly');

exports.fetch = fetch;
exports.missing = missing;

const databases = {
  DBLP: 'http://dblp.uni-trier.de/rec/bibtex1'
}

function missing(latexSource) {
  return new Promise((resolve, reject) => {
    let tempDir = `bibly-output`;
    let [cmd, ...args] = `latex -interaction nonstopmode -output-directory=${tempDir} ${latexSource}`.split(' ');
    fs.ensureDirSync(tempDir);
    let latex = cp.spawnSync(cmd, args);
    fs.removeSync(tempDir);
    let entries = latex.stdout.toString()
      .split("\n")
      .filter(line => line.match(/Citation/))
      .map(line => line.match(/`(.*)'/)[1]);
    entries = [...new Set(entries)];
    debug(`got entries: ${entries}`);
    resolve(entries);
  });
}

async function fetch(entry) {
  try {
    return {
      key: entry,
      record: await get(entry)
    };
  } catch (e) {
    return {
      key: entry,
      error: e
    };
  }
}

async function get(entry) {
  debug(`fetching: ${entry}`);

  let m = entry.match(/^(\w*):(.*)$/);

  if (!m)
    throw `unknown entry format: ${entry}`;

  let db = m[1] || '';
  let key = m[2] || '';

  debug(`using database: ${db}`);
  debug(`using key: ${key}`);

  if (!databases[db])
    throw `unknown database ${db}`;

  let url = `${databases[db]}/${key}`;
  debug(`using url: ${url}`);

  let $;

  try {
    $ = cheerio.load(await request(url));
  } catch (e) {
    if (e.name === 'StatusCodeError')
      throw `request failed with code ${e.statusCode}`;
    else
      throw e;
  }

  let code = $('#bibtex-section > pre').text();
  debug(`received code: ${code}`);
  return code;
}
