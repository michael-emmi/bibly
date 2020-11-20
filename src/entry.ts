import * as cp from 'child_process';
import * as fs from 'fs-extra'
import Debug from 'debug';
import { Databases } from "./config";

const debug = Debug('bibly:entry');

export function getEntries(latexSource: string, databases: Databases): Promise<string[]> {
    const dbExpr = `^(${Object.keys(databases).join('|')}):`;
    return new Promise((resolve, reject) => {
        try {
            const tempDir = `bibly-output`;
            fs.ensureDirSync(tempDir);
            const latex = cp.spawnSync('latex', [
                '-interaction', 'nonstopmode',
                '-jobname', 'bibly',
                '-output-directory', tempDir,
                latexSource
            ]);
            fs.removeSync(tempDir);
            let entries = latex.stdout.toString()
                .split("\n")
                .filter(line => line.match(/Citation/))
                .map(line => line.match(/`(.*)'/)?.[1])
                .filter(entry => entry?.match(dbExpr))
                .filter((e): e is string => e != null);
            entries = [...new Set(entries)];
            debug(`got entries: ${entries}`);
            resolve(entries);

        } catch (e) {
            reject(e);
        }
    });
}
