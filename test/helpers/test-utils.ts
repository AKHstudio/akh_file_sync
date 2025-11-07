import path from 'path';
import fs from 'fs-extra';
import { temporaryDirectory } from 'tempy';
import { execa } from 'execa';
import * as tar from 'tar';

export interface TestEnvironment {
    tempDir: string;
    originalCwd: string;
    builtBinaryPath: string;
    debugDirPath: string;
}

export async function setupTestEnvironment(): Promise<TestEnvironment> {
    const tempDir = temporaryDirectory();
    const originalCwd = process.cwd();
    const builtBinaryPath = path.join(originalCwd, 'dist/bin/akhsync.js');
    const debugDirPath = path.join(tempDir, 'debug');

    // ビルド済みファイルの存在確認
    if (!(await fs.pathExists(builtBinaryPath))) {
        throw new Error('Built binary not found. Please run "npm run build" before testing.');
    }

    // fixture.tar.gz をコピー・解凍
    const originalDebugTarPath = path.join(originalCwd, 'test', 'fixtures', 'fixture.tar.gz');
    if (!(await fs.pathExists(originalDebugTarPath))) {
        throw new Error('Original fixture.tar.gz not found in test fixtures.');
    }

    await fs.copy(originalDebugTarPath, path.join(tempDir, 'fixture.tar.gz'));
    await tar.x({
        file: path.join(tempDir, 'fixture.tar.gz'),
        cwd: tempDir,
    });

    // npm install
    await execa('npm', ['install'], {
        cwd: debugDirPath,
        stdio: 'inherit',
    });

    return {
        tempDir,
        originalCwd,
        builtBinaryPath,
        debugDirPath,
    };
}

export async function cleanupTestEnvironment(tempDir: string) {
    await fs.remove(tempDir);
}

export async function cleanupBuildArtifacts(debugDirPath: string) {
    const buildPath = path.join(debugDirPath, 'build');
    const distPath = path.join(debugDirPath, 'dist');

    if (await fs.pathExists(buildPath)) {
        await fs.remove(buildPath);
    }
    if (await fs.pathExists(distPath)) {
        await fs.remove(distPath);
    }
}

export function getDebugAddonDirectories(tempSrcDir: string): string[] {
    const directories = fs.readdirSync(tempSrcDir, { withFileTypes: true });

    return directories
        .filter((dir) => {
            return dir.isDirectory();
        })
        .map((dir) => path.join(tempSrcDir, dir.name));
}
