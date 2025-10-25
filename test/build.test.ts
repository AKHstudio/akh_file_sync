import path from 'path';

import { describe, it, expect, afterEach, afterAll, beforeAll } from 'vitest';
import { execa } from 'execa';
import { temporaryDirectory } from 'tempy';
import fs from 'fs-extra';
import * as tar from 'tar';

describe('Build Process Test', () => {
    let tempDir: string;
    let debugDirPath: string;
    let originalCwd: string;
    let builtBinaryPath: string;

    beforeAll(async () => {
        tempDir = temporaryDirectory();
        originalCwd = process.cwd();

        // ビルド済みのバイナリパスを指定
        builtBinaryPath = path.join(originalCwd, 'dist/bin/akhsync.js');

        // debug ディレクトリのパス
        debugDirPath = path.join(tempDir, 'debug');

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

    afterAll(async () => {
        process.chdir(originalCwd);
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
