import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';

import { setupTestEnvironment } from '../helpers/test-utils';

describe('Version Display Test', () => {
    let tempDir: string;
    let builtBinaryPath: string;
    let debugDirPath: string;

    beforeAll(async () => {
        const env = await setupTestEnvironment();
        tempDir = env.tempDir;
        debugDirPath = env.debugDirPath;
        builtBinaryPath = env.builtBinaryPath;
    });

    afterAll(async () => {
        await fs.remove(tempDir);
    });

    it('should display version correctly', async () => {
        console.log('Built binary path:', builtBinaryPath);
        console.log('Binary exists:', await fs.pathExists(builtBinaryPath));
        console.log('Current working directory:', tempDir);

        const versionResult = await execa('node', [builtBinaryPath, '--version'], {
            cwd: debugDirPath,
            stdio: 'pipe',
        });

        expect(versionResult.exitCode).toBe(0);
        expect(versionResult.stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should display help information', async () => {
        const helpResult = await execa('node', [builtBinaryPath, '--help'], {
            cwd: debugDirPath,
            stdio: 'pipe',
        });

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage:');
        expect(helpResult.stdout).toContain('Commands:');
    });
});
