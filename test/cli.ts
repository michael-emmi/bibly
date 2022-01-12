import assert from 'assert';
import child_process from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import util from 'util';

const exec = util.promisify(child_process.exec);
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'dist', 'cli.js');
const command = `node ${cli}`;
const resources = path.join(root, 'resources');
const documents = path.join(resources, 'latex');

describe('The bibly CLI', function () {
    this.timeout(5000);

    for (const document of fs.readdirSync(documents)) {
        it(`should work on the sample document ${document}`, async () => {
            try {
                const cwd = path.join(documents, document);
                const { stdout, stderr } = await exec(command, { cwd });

            } catch (error) {
                assert.fail(error as Error);
            }
        });
    }
});
