import path from 'path';

import { describe, it, expect, afterEach, afterAll, beforeAll } from 'vitest';
import { execa } from 'execa';
import { temporaryDirectory } from 'tempy';
import fs from 'fs-extra';
import * as tar from 'tar';

describe('Dist Process Test', () => {
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
