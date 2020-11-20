import Debug from 'debug';
import request from 'request-promise';
import { Databases } from "./config";
import { fail } from 'assert';

const debug = Debug('bibly:record');

export interface Record {
    key: string;
    db: string;
    record: string;
}

export function isRecord(object: any): object is Record {
    const record = object as Record;
    return record?.key !== undefined
        && record.db !== undefined
        && record.record !== undefined;
}

export interface RecordError {
    key: string;
    error: string;
}

export async function getRecord(entry: string, databases: Databases): Promise<Record | RecordError> {
    try {
        debug(`fetching: ${entry}`);

        const {db, key} = unpackEntry(entry);
        debug(`database: ${db}`);
        debug(`key: ${key}`);

        const url = composeUrl(db, key, databases);
        debug(`url: ${url}`);

        const record = await fetchRecord(url);
        debug(`record: ${record}`);

        return { key: entry, db, record };
    } catch (e) {
        return { key: entry, error: e };
    }
}

function unpackEntry(entry: string) {
    const m = entry.match(/^(\w*):(.*)$/);
    if (!m) {
        fail(`unknown entry format: ${entry}`);
    }
    return {
        db: m[1] || '',
        key: m[2] || ''
    };
}

function composeUrl(db: string, key: string, databases: Databases): string {
    const database = databases[db];

    if (!database) {
        fail(`unknown database ${db}`);
    }

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

async function fetchRecord(url: string) {
    try {
        return await request(url);
    } catch (e) {
        if (e.name === 'StatusCodeError') {
            fail(`request failed with code ${e.statusCode}`);
        } else {
            throw e;
        }
    }
}
