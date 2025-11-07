import path from 'path';

import { describe, it, expect, afterEach, afterAll, beforeAll } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';

import { setupTestEnvironment } from '../helpers/test-utils';

describe('Dist Process Test', () => {
    let tempDir: string;
    let debugDirPath: string;
    let builtBinaryPath: string;

    beforeAll(async () => {
        const env = await setupTestEnvironment();
        tempDir = env.tempDir;
        debugDirPath = env.debugDirPath;
        builtBinaryPath = env.builtBinaryPath;
    });

    afterAll(async () => {
        await fs.remove(tempDir);
    });

    afterEach(async () => {
        if (fs.pathExistsSync(path.join(debugDirPath, 'build'))) {
            await fs.remove(path.join(debugDirPath, 'build'));
        }

        if (fs.pathExistsSync(path.join(debugDirPath, 'dist'))) {
            await fs.remove(path.join(debugDirPath, 'dist'));
        }
    });

    it('should display help information', async () => {
        const helpResult = await execa('node', [builtBinaryPath, 'dist', '--help'], {
            cwd: debugDirPath,
            stdio: 'pipe',
        });

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage: akhsync dist [directory...] [options]');
    });

    describe("run 'akhsync dist' command", () => {
        it('should dist the project successfully', async () => {
            const distResult = await execa('node', [builtBinaryPath, 'dist'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(distResult.stdout);
            console.log(distResult.stderr);

            const distFiles = fs.readdirSync(path.join(debugDirPath, 'dist'));
            console.log(distFiles);

            expect(distResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'dist'))).toBe(true);
            expect(distFiles.find((file) => file.endsWith('.mcaddon'))).toBeTruthy();
        });
    });

    describe("run 'akhsync dist' command with options", () => {
        it(`should dist the project successfully with --type addon world`, async () => {
            const distResult = await execa('node', [builtBinaryPath, 'dist', '--type', 'addon', 'world'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(distResult.stdout);
            console.log(distResult.stderr);

            const distFiles = fs.readdirSync(path.join(debugDirPath, 'dist'));
            console.log(distFiles);

            expect(distResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'dist'))).toBe(true);
            expect(distFiles.find((file) => file.endsWith('mcaddon'))).toBeTruthy();
            expect(distFiles.find((file) => file.endsWith('mcworld'))).toBeTruthy();
        });

        ['world', 'addon'].forEach((type) => {
            it(`should dist the project successfully with --type ${type}`, async () => {
                const distResult = await execa('node', [builtBinaryPath, 'dist', '--type', type], {
                    cwd: debugDirPath,
                    stdio: 'pipe',
                });

                console.log(distResult.stdout);
                console.log(distResult.stderr);

                const distFiles = fs.readdirSync(path.join(debugDirPath, 'dist'));
                console.log(distFiles);

                expect(distResult.exitCode).toBe(0);
                expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
                expect(fs.pathExistsSync(path.join(debugDirPath, 'dist'))).toBe(true);
                expect(distFiles.find((file) => file.endsWith('mc' + type))).toBeTruthy();
            });
        });

        it(`should dist the project successfully with --set-version`, async () => {
            const distResult = await execa('node', [builtBinaryPath, 'dist', '--set-version', '9.9.9'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(distResult.stdout);
            console.log(distResult.stderr);

            const distFiles = fs.readdirSync(path.join(debugDirPath, 'dist'));
            console.log(distFiles);

            expect(distResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'dist'))).toBe(true);
            expect(distFiles.find((file) => file.includes('9.9.9'))).toBeTruthy();
        });
    });
});
