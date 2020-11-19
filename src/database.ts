import Debug from 'debug';

const debug = Debug('bibly:database');

export interface Database {
    file: string;
    parameters: Parameters;
    suffix: string;
    url: string;
}

export interface Parameters {
    [key: string]: string | number;
}

export function isDatabase(object: any): object is Database {
    const database = object as Database;
    debug(database);
    return database?.url !== undefined
        && database.suffix !== undefined
        && database.parameters !== undefined
        && database.file !== undefined;
}
