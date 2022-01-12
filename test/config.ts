import 'mocha';
import { assert, use } from 'chai';
import chai from 'chai-as-promised';
import path from 'path';
import { readConfig, isConfig } from '../src/config';

use(chai);

describe('sample configuration files', () => {
    const resourcePath = path.join('resources/config');
    const validConfigFiles = [
        'config.json',
        'config-with-latex.json',
    ];

    const invalidConfigFiles = [
        'config-invalid-1.json',
        'config-invalid-2.json',
        'config-invalid-3.json'
    ];

    for (const configFile of validConfigFiles) {
        it(`${configFile} is a valid configuration file`, async () => {
            const config = await readConfig(path.join(resourcePath, configFile));
            assert.isTrue(isConfig(config));
        });
    }

    for (const configFile of invalidConfigFiles) {
        it(`${configFile} is a not valid configuration file`, async () => {
            assert.isRejected(readConfig(path.join(resourcePath, configFile)));
        });
    }

});
