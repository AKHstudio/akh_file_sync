import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { build } from 'esbuild';

import { AKHsyncConfig } from '@/config/types.js';

// prettier-ignore
const CONFIG_FILES = [
    'akhsync.config.ts',
    'akhsync.config.mts',
    'akhsync.config.js',
    'akhsync.config.mjs',
    'akhsync.config.cjs',
];

function searchConfigFile(): string | null {
    const currentDir = process.cwd();

    for (const fileName of CONFIG_FILES) {
        const filePath = path.join(currentDir, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }

    return null;
}

export async function loadConfig(): Promise<AKHsyncConfig | null> {
    const configFile = searchConfigFile();

    if (configFile === null) {
        return null;
    }

    if (configFile.endsWith('.ts') || configFile.endsWith('.mts')) {
        const result = await build({
            entryPoints: [configFile],
            bundle: true,
            platform: 'node',
            format: 'esm',
            write: false,
        });

        const { text } = result.outputFiles[0];

        const dataUrl = `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
        const module = await import(dataUrl);

        return module.default as AKHsyncConfig;
    } else {
        const module = await import(pathToFileURL(configFile).toString());
        return module.default as AKHsyncConfig;
    }
}
