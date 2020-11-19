import * as fs from 'fs-extra';
import Debug from 'debug';
import { fail } from 'assert';
import { Database, isDatabase } from './database';

const debug = Debug('bibly:config');

export interface Config {
    databases: Databases;
    latex?: string;
    sort?: boolean;
}

export interface Databases {
    [key: string]: Database;
}

export function isConfig(object: any): object is Config {
    const config = object as Config;
    return (config?.latex === undefined || typeof config?.latex === 'string') && isDatabases(config?.databases);
}

export function isDatabases(object: any): object is Databases {
    return Object.values(Object(object)).every(isDatabase);
}

export function getConfig(object: any): Config | undefined {
    if (isConfig(object)) {
        return object;
    }
}

export function getDatabases(databases: any): Databases | undefined {
    if (isDatabases(databases)) {
        return databases;
    }
}

export async function readConfig(configFile: string): Promise<Config> {
    const json = await fs.readJson(configFile);
    debug(json);
    const config = getConfig(json);
    if (config === undefined) {
        fail(`invalid configuration file ${configFile}`);
    }
    return config;
}
