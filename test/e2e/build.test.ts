import path from 'path';

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';

import { setupTestEnvironment } from '../helpers/test-utils';

describe('Build Process Test', () => {
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
    });

    it('should display help information', async () => {
        const helpResult = await execa('node', [builtBinaryPath, 'build', '--help'], {
            cwd: debugDirPath,
            stdio: 'pipe',
        });

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage: akhsync build [directory...] [options]');
    });

    describe("run 'akhsync build' command", () => {
        it('should build the project successfully', async () => {
            const buildResult = await execa('node', [builtBinaryPath, 'build'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(buildResult.stdout);
            console.log(buildResult.stderr);

            expect(buildResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
        });

        it('should build the project successfully in development mode', async () => {
            const buildResult = await execa('node', [builtBinaryPath, 'build', '--development'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(buildResult.stdout);
            console.log(buildResult.stderr);

            expect(buildResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
        });
    });

    describe('build run with only option', () => {
        ['behavior', 'resource'].forEach((onlyOption) => {
            it(`should build the project successfully in only ${onlyOption} `, async () => {
                const buildResult = await execa('node', [builtBinaryPath, 'build', '--only', onlyOption], {
                    cwd: debugDirPath,
                    stdio: 'pipe',
                });

                console.log(buildResult.stdout);
                console.log(buildResult.stderr);

                expect(buildResult.exitCode).toBe(0);
                expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            });
        });
    });

    describe("Error handling 'akhsync build' command", () => {
        it('Error handling Non-existent directory', async () => {
            const buildResult = await execa('node', [builtBinaryPath, 'build', 'g5a64g6a4g6'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            console.log(buildResult.stdout);
            console.log(buildResult.stderr);

            expect(buildResult.exitCode).toBe(1);
        });

        it('Error handling Add-ons directory does not exist', async () => {
            const srcDir = path.join(debugDirPath, 'src');
            const srcBackupDir = path.join(debugDirPath, 'src_backup');

            fs.mkdirSync(srcBackupDir);
            fs.copySync(srcDir, srcBackupDir);
            fs.removeSync(srcDir);

            const buildResult = await execa('node', [builtBinaryPath, 'build'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            console.log(buildResult.stdout);
            console.log(buildResult.stderr);

            expect(buildResult.exitCode).toBe(1);

            fs.copySync(srcBackupDir, srcDir);
            fs.removeSync(srcBackupDir);
        });
    });
});
