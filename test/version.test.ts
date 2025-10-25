import path from 'path';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';
import { temporaryDirectory } from 'tempy';
import * as tar from 'tar';

describe('Version Display Test', () => {
    let tempDir: string;
    let originalCwd: string;
    let builtBinaryPath: string;
    let debugDirPath: string;

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
