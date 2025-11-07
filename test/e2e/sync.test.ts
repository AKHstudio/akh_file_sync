import path from 'path';

import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';

import { setupTestEnvironment } from '../helpers/test-utils';

describe('Sync Process Test', () => {
    let tempDir: string;
    let builtBinaryPath: string;
    let debugDirPath: string;
    let syncTargetDir: string;

    beforeEach(async () => {
        const env = await setupTestEnvironment();
        tempDir = env.tempDir;
        debugDirPath = env.debugDirPath;
        builtBinaryPath = env.builtBinaryPath;

        syncTargetDir = path.join(debugDirPath, 'akhsync_sync_target');
    });

    afterEach(async () => {
        await fs.remove(tempDir);
    });

    it('should display help information', async () => {
        const helpResult = await execa('node', [builtBinaryPath, 'sync', '--help'], {
            cwd: debugDirPath,
            stdio: 'pipe',
        });

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage: akhsync sync [directory...] [options]');
    });

    describe("run 'akhsync sync' and 'akhsync async' commands", () => {
        it('should sync and async the project successfully', async () => {
            const syncResult = await execa('node', [builtBinaryPath, 'sync'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(syncResult.stdout);
            console.log(syncResult.stderr);

            console.log(fs.readdirSync(path.join(syncTargetDir, 'development_behavior_packs')));
            console.log(fs.readdirSync(path.join(syncTargetDir, 'development_resource_packs')));

            expect(syncResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(true);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(true);

            const asyncResult = await execa('node', [builtBinaryPath, 'async'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });
            console.log(asyncResult.stdout);
            console.log(asyncResult.stderr);

            expect(asyncResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(false);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(false);
        });

        it('should sync the project successfully in development mode', async () => {
            const syncResult = await execa('node', [builtBinaryPath, 'sync', '--development'], {
                cwd: debugDirPath,
                stdio: 'pipe',
            });

            console.log(syncResult.stdout);
            console.log(syncResult.stderr);

            expect(syncResult.exitCode).toBe(0);
            expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(true);
            expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(true);
        });
    });

    describe('sync and async run with only option', () => {
        ['behavior', 'resource'].forEach((onlyOption) => {
            it(`should sync and async the project successfully in only ${onlyOption} `, async () => {
                const syncResult = await execa('node', [builtBinaryPath, 'sync', '--only', onlyOption], {
                    cwd: debugDirPath,
                    stdio: 'pipe',
                });

                console.log(syncResult.stdout);
                console.log(syncResult.stderr);

                expect(syncResult.exitCode).toBe(0);
                expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
                if (onlyOption === 'behavior') {
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(true);
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(false);
                } else {
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(true);
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(false);
                }

                const asyncResult = await execa('node', [builtBinaryPath, 'async', '--only', onlyOption], {
                    cwd: debugDirPath,
                    stdio: 'pipe',
                });

                console.log(asyncResult.stdout);
                console.log(asyncResult.stderr);

                expect(asyncResult.exitCode).toBe(0);
                expect(fs.pathExistsSync(path.join(debugDirPath, 'build'))).toBe(true);
                if (onlyOption === 'behavior') {
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_behavior_packs', 'akhsync-informant-debug'))).toBe(false);
                } else {
                    expect(fs.pathExistsSync(path.join(syncTargetDir, 'development_resource_packs', 'akhsync-informant-debug'))).toBe(false);
                }
            });
        });
    });

    describe("Error handling 'akhsync sync' and 'akhsync async' commands", () => {
        it('Error handling Non-existent directory', async () => {
            const SyncResult = await execa('node', [builtBinaryPath, 'sync', 'g5a64g6a4g6'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            const asyncResult = await execa('node', [builtBinaryPath, 'async', 'g5a64g6a4g6'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            console.log(SyncResult.stdout);
            console.log(SyncResult.stderr);

            console.log(asyncResult.stdout);
            console.log(asyncResult.stderr);

            expect(SyncResult.exitCode).toBe(1);
            expect(asyncResult.exitCode).toBe(1);
        });

        it('Error handling Add-ons directory does not exist', async () => {
            const srcDir = path.join(debugDirPath, 'src');
            const srcBackupDir = path.join(debugDirPath, 'src_backup');

            fs.mkdirSync(srcBackupDir);
            fs.copySync(srcDir, srcBackupDir);
            fs.removeSync(srcDir);

            const SyncResult = await execa('node', [builtBinaryPath, 'sync'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            const asyncResult = await execa('node', [builtBinaryPath, 'async'], {
                cwd: debugDirPath,
                stdio: 'pipe',
                reject: false,
            });

            console.log(SyncResult.stdout);
            console.log(SyncResult.stderr);

            console.log(asyncResult.stdout);
            console.log(asyncResult.stderr);

            expect(SyncResult.exitCode).toBe(1);
            expect(asyncResult.exitCode).toBe(1);

            fs.copySync(srcBackupDir, srcDir);
            fs.removeSync(srcBackupDir);
        });
    });
});
