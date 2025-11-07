import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { temporaryDirectory } from 'tempy';
import fs from 'fs-extra';
import path from 'path';

function removeWithRetry(dirPath: string, delay = 100): void {
    try {
        setTimeout(async () => {
            await fs.remove(dirPath);
        }, delay);
    } catch {
        return removeWithRetry(dirPath, delay + 100);
    }
}

describe('Index Module', () => {
    let tempDir: string;
    let originalCwd: string;

    beforeAll(async () => {
        originalCwd = process.cwd();
        tempDir = temporaryDirectory();
        process.chdir(tempDir);

        // srcディレクトリを作成（index.tsの要件を満たす）
        await fs.ensureDir(path.join(tempDir, 'src'));
    });

    afterAll(async () => {
        process.chdir(originalCwd);

        // キャッシュをクリア
        vi.resetModules();
        vi.clearAllMocks();

        // 一時ディレクトリを削除
        removeWithRetry(tempDir);
    });

    describe('Default configuration (no config file)', () => {
        it('should use default syncTargetDir when no config', async () => {
            // 設定ファイルが存在しない状態で動的にインポート
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?nocache=${Date.now()}`);

            expect(module.syncTargetDir).toContain('Microsoft.MinecraftUWP');
        });

        it('should use default worldDirName when no config', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?nocache=${Date.now()}`);

            expect(module.worldDir).toContain('world');
        });
    });

    describe('Custom configuration (with config file)', () => {
        const configSyncTargetDir = './my_sync_target';
        const configWorldDirName = 'world_test';

        beforeAll(async () => {
            // 設定ファイルを作成
            const configFilePath = path.join(tempDir, 'akhsync.config.ts');
            const configContent = `export default {
    syncTargetDir: '${configSyncTargetDir}',
    worldDirName: '${configWorldDirName}',
};`;
            await fs.outputFile(configFilePath, configContent);
        });

        it('should use custom syncTargetDir from config', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?config=${Date.now()}`);

            expect(module.syncTargetDir).toBe(configSyncTargetDir);
        });

        it('should use custom worldDirName from config', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?config=${Date.now()}`);

            expect(module.worldDir).toContain(configWorldDirName);
        });

        it('should log config information when config is loaded', async () => {
            const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

            await import(path.join(originalCwd, 'src/index.ts') + `?log=${Date.now()}`);

            expect(consoleInfoSpy).toHaveBeenCalledWith(
                '⚙️ ',
                '設定ファイルを読み込みました。\n',
                expect.objectContaining({
                    syncTargetDir: configSyncTargetDir,
                    worldDirName: configWorldDirName,
                }),
            );

            consoleInfoSpy.mockRestore();
        });
    });

    describe('Path exports', () => {
        it('should export correct path types', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?paths=${Date.now()}`);

            expect(typeof module.syncTargetDir).toBe('string');
            expect(typeof module.srcDir).toBe('string');
            expect(typeof module.buildDir).toBe('string');
            expect(typeof module.distDir).toBe('string');
            expect(typeof module.worldDir).toBe('string');
        });

        it('should use process.cwd() for srcDir', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?src=${Date.now()}`);

            expect(module.srcDir).toBe(path.join(tempDir, 'src'));
        });

        it('should use process.cwd() for buildDir', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?build=${Date.now()}`);

            expect(module.buildDir).toBe(path.join(tempDir, 'build'));
        });

        it('should use process.cwd() for distDir', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?dist=${Date.now()}`);

            expect(module.distDir).toBe(path.join(tempDir, 'dist'));
        });
    });

    describe('Constants', () => {
        it('should export akhsyncFlag constant', async () => {
            const module = await import(path.join(originalCwd, 'src/index.ts') + `?flag=${Date.now()}`);

            expect(module.akhsyncFlag).toBe('akhsync');
        });
    });

    describe('Error handling', () => {
        it('should exit with code 1 when src directory does not exist', async () => {
            const noSrcTempDir = temporaryDirectory();
            const originalExit = process.exit;
            const originalConsoleError = console.error;

            let exitCode: number | undefined;
            let errorMessage: string = '';

            // モック
            process.exit = (code: number) => {
                exitCode = code;
                throw new Error(`Process exited with code ${code}`);
            };

            console.error = (...args) => {
                errorMessage = args.join(' ');
            };

            const originalCwdForError = process.cwd();
            process.chdir(noSrcTempDir);

            try {
                // srcディレクトリが存在しない状態でインポート
                await import(path.join(originalCwd, 'src/index.ts') + `?nosrc=${Date.now()}`);
            } catch (error: unknown) {
                // process.exitがthrowしたエラーをキャッチ
                expect((error as Error).message).toContain(`Process exited with code 1`);
            }

            // 復元
            process.exit = originalExit;
            console.error = originalConsoleError;
            process.chdir(originalCwdForError);

            // リトライ削除
            await fs.remove(noSrcTempDir);

            expect(exitCode).toBe(1);
            expect(errorMessage).toContain('srcディレクトリが見つかりません');
            expect(errorMessage).toContain(path.join(noSrcTempDir, 'src'));
        });
    });

    describe('Config loader integration', () => {
        it('should return null when config file does not exist', async () => {
            const { loadConfig } = await import(path.join(originalCwd, 'src/config/loader.ts') + `?nocache=${Date.now()}`);

            // 設定ファイルを削除
            const configPath = path.join(tempDir, 'akhsync.config.ts');
            await fs.remove(configPath);

            const config = await loadConfig();
            expect(config).toBeNull();
        });

        it('should load config when config file exists', async () => {
            const configSyncTargetDir = './test_sync';
            const configWorldDirName = 'test_world';

            const configFilePath = path.join(tempDir, 'akhsync.config.ts');
            const configContent = `export default {
    syncTargetDir: '${configSyncTargetDir}',
    worldDirName: '${configWorldDirName}',
};`;
            await fs.outputFile(configFilePath, configContent);

            const { loadConfig } = await import(path.join(originalCwd, 'src/config/loader.ts') + `?reload=${Date.now()}`);
            const config = await loadConfig();

            expect(config).not.toBeNull();
            expect(config?.syncTargetDir).toBe(configSyncTargetDir);
            expect(config?.worldDirName).toBe(configWorldDirName);
        });
    });
});
