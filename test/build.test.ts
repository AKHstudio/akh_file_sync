import path from 'path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { temporaryDirectory } from 'tempy';
import fs from 'fs-extra';
import * as tar from 'tar';

describe('Build Process Test', () => {
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

        // debug.tar.gz をテスト用ディレクトリにコピー
        const originalDebugTarPath = path.join(originalCwd, 'debug.tar.gz');
        const debugTarPath = path.join(tempDir, 'debug.tar.gz');

        if (!(await fs.pathExists(originalDebugTarPath))) {
            throw new Error('debug.tar.gz not found in the original directory.');
        }

        await fs.copyFile(originalDebugTarPath, debugTarPath);

        // tar ライブラリで解凍
        await tar.x({
            file: debugTarPath,
            cwd: tempDir,
        });

        // 解凍後、debug.tar.gz を削除
        await fs.remove(debugTarPath);

        // npm install を実行して依存関係をインストール
        await execa('npm', ['install'], {
            cwd: path.join(tempDir, 'debug'),
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
        const helpResult = await execa('node', [builtBinaryPath, 'build', '--help'], {
            cwd: tempDir,
            stdio: 'pipe',
        });

        expect(helpResult.exitCode).toBe(0);
        expect(helpResult.stdout).toContain('Usage: akhsync build [directory...] [options]');
    });
});
