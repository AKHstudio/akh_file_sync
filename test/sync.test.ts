import path from 'path';

import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { execa } from 'execa';
import { temporaryDirectory } from 'tempy';
import fs from 'fs-extra';
import * as tar from 'tar';

describe('Sync Process Test', () => {
    let tempDir: string;
    let originalCwd: string;
    let builtBinaryPath: string;
    let debugDirPath: string;
    let syncTargetDir: string;

    beforeEach(async () => {
        tempDir = temporaryDirectory();
        originalCwd = process.cwd();

        // ビルド済みのバイナリパスを指定
        builtBinaryPath = path.join(originalCwd, 'dist/bin/akhsync.js');

        // debug ディレクトリのパス
        debugDirPath = path.join(tempDir, 'debug');

        syncTargetDir = path.join(debugDirPath, 'akhsync_sync_target');

        // 存在しない場合は syncTargetDir を作成
        fs.ensureDirSync(syncTargetDir);
        fs.ensureDirSync(path.join(syncTargetDir, 'development_behavior_packs'));
        fs.ensureDirSync(path.join(syncTargetDir, 'development_resource_packs'));

        // ビルド済みファイルの存在確認
        if (!(await fs.pathExists(builtBinaryPath))) {
            throw new Error('Built binary not found. Please run "npm run build" before testing.');
        }

        // debug.tar.gz をテスト用ディレクトリにコピー
        const originalDebugTarPath = path.join(originalCwd, 'test', 'fixtures', 'fixture.tar.gz');

        if (!(await fs.pathExists(originalDebugTarPath))) {
            throw new Error('Original fixture.tar.gz not found in test fixtures.');
        }

        await fs.copy(originalDebugTarPath, path.join(tempDir, 'fixture.tar.gz'));

        // fixture.tar.gz を解凍
        await tar.x({
            file: path.join(tempDir, 'fixture.tar.gz'),
            cwd: tempDir,
        });

        console.log(fs.readdirSync(tempDir));

        // npm install を実行して依存関係をインストール
        await execa('npm', ['install'], {
            cwd: debugDirPath,
            stdio: 'inherit',
        });

        // 作業ディレクトリを一時ディレクトリに変更
        process.chdir(tempDir);
    });

    afterEach(async () => {
        process.chdir(originalCwd);
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
