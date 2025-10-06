import path from 'path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';
import { temporaryDirectory } from 'tempy';

describe('Version Display Test', () => {
    let tempDir: string;
    let originalCwd: string;
    let builtBinaryPath: string;

    beforeEach(async () => {
        tempDir = temporaryDirectory();
        originalCwd = process.cwd();

        // ビルド済みのバイナリパスを指定
        builtBinaryPath = path.join(originalCwd, 'dist/bin/akhsync.js');

        // ビルド済みファイルの存在確認
        if (!(await fs.pathExists(builtBinaryPath))) {
            throw new Error('Built binary not found. Please run "npm run build" before testing.');
        }

        const packageJson = {
            name: 'test-addon',
            version: '1.0.0',
            description: 'Test Minecraft addon',
        };

        await fs.writeJson(path.join(tempDir, 'package.json'), packageJson);
        await fs.ensureDir(path.join(tempDir, 'src'));
        await fs.ensureDir(path.join(tempDir, 'behavior_packs'));
        await fs.ensureDir(path.join(tempDir, 'resource_packs'));

        process.chdir(tempDir);
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(tempDir);
    });

    it('should display version correctly', async () => {
        console.log('Built binary path:', builtBinaryPath);
        console.log('Binary exists:', await fs.pathExists(builtBinaryPath));
        console.log('Current working directory:', tempDir);

        const versionResult = await execa('node', [builtBinaryPath, '--version'], {
            cwd: tempDir,
            stdio: 'pipe',
        });

        expect(versionResult.exitCode).toBe(0);
        expect(versionResult.stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should display help information', async () => {
        const helpResult = await execa('node', [builtBinaryPath, '--help'], {
            cwd: tempDir,
            stdio: 'pipe',
        });

        console.log('Exit Code:', helpResult.exitCode);
        console.log('Stdout:', JSON.stringify(helpResult.stdout));
        console.log('Stderr:', JSON.stringify(helpResult.stderr));
        console.log('Command:', helpResult.command);

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage:');
        expect(helpResult.stdout).toContain('Commands:');
    });
});
