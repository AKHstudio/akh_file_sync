import { execa } from 'execa';
import { mkdirSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compare } from 'dir-compare';
import { writeFile } from 'fs/promises';
import stripAnsi from 'strip-ansi';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('build command tests', () => {
    const cwd = path.join(__dirname, '..');
    const debugDir = path.join(cwd, 'debug');
    const buildDir = path.join(debugDir, 'build');
    const outputFilePath = path.join(debugDir, 'output', 'build');

    // console.log(`debugDir: ${debugDir}`);
    // console.log(`cwd: ${cwd}`);

    // 毎testの前に実行
    beforeEach(() => {
        // debugのbuildディレクトリを削除
        rmSync(buildDir, { recursive: true, force: true });
    });

    // テスト開始時に一度実行
    beforeAll(async () => {
        // akhsyncコマンドの確認
        const akhsyncResult = await execa('akhsync', ['--version'], { cwd, reject: false });
        if (akhsyncResult.exitCode !== 0) {
            await execa('npm', ['run', 'build'], { cwd, reject: false });
            await execa('npm', ['link'], { cwd, reject: false });
        }

        // output ディレクトリを削除
        rmSync(outputFilePath, { recursive: true, force: true });

        // output ディレクトリを作成
        mkdirSync(outputFilePath, { recursive: true });
    });

    // テストが終わった後に実行
    afterAll(() => {
        // debugのbuildディレクトリを削除
        rmSync(buildDir, { recursive: true, force: true });
    });

    test('build command run with help', async () => {
        const buildResult = await execa('akhsync', ['build', '--help'], { cwd: debugDir, reject: false });

        writeFile(path.join(outputFilePath, 'build-help.log'), buildResult.stdout, { encoding: 'utf-8' }).catch((err) => {
            console.error('Error writing build-help.log:', err);
        });

        expect(buildResult.exitCode).toBe(0);
    });

    test('build command run', async () => {
        const expectDir = path.join(debugDir, 'expect', 'build');

        const buildResult = await execa('akhsync', ['build'], { cwd: debugDir, reject: false });

        writeFile(path.join(outputFilePath, 'build.log'), stripAnsi(buildResult.stdout), { encoding: 'utf-8' }).catch((err) => {
            console.error('Error writing build.log:', err);
        });

        // check exit code
        expect(buildResult.exitCode).toBe(0);

        const compareResult = await compare(buildDir, expectDir, {
            compareContent: true,
            skipSymlinks: true,
        });

        // check compare result
        expect(compareResult.same).toBe(true);
    }, 10000);

    test('build command run with -d', async () => {
        const expectDir = path.join(debugDir, 'expect', 'build-d');

        const buildResult = await execa('akhsync', ['build', '-d'], { cwd: debugDir, reject: false });

        writeFile(path.join(outputFilePath, 'build-d.log'), stripAnsi(buildResult.stdout), { encoding: 'utf-8' }).catch((err) => {
            console.error('Error writing build-d.log:', err);
        });

        // check exit code
        expect(buildResult.exitCode).toBe(0);

        const compareResult = await compare(buildDir, expectDir, {
            compareContent: true,
            skipSymlinks: true,
        });

        // check compare result
        expect(compareResult.same).toBe(true);
    }, 10000);

    ['behavior', 'resource'].forEach((type) => {
        test(`build command run with -o ${type}`, async () => {
            const expectDir = path.join(debugDir, 'expect', `build-o-${type}`);

            const buildResult = await execa('akhsync', ['build', '-o', type], { cwd: debugDir, reject: false });

            writeFile(path.join(outputFilePath, `build-o-${type}.log`), stripAnsi(buildResult.stdout), { encoding: 'utf-8' }).catch((err) => {
                console.error('Error writing build-t.log:', err);
            });

            // check exit code
            expect(buildResult.exitCode).toBe(0);

            const compareResult = await compare(buildDir, expectDir, {
                compareContent: true,
                skipSymlinks: true,
            });

            // check compare result
            expect(compareResult.same).toBe(true);
        }, 10000);

        test(`build command run with -o ${type} -d`, async () => {
            const expectDir = path.join(debugDir, 'expect', `build-d-o-${type}`);

            const buildResult = await execa('akhsync', ['build', '-o', type, '-d'], { cwd: debugDir, reject: false });

            writeFile(path.join(outputFilePath, `build-d-o-${type}.log`), stripAnsi(buildResult.stdout), { encoding: 'utf-8' }).catch((err) => {
                console.error('Error writing build-t.log:', err);
            });

            // check exit code
            expect(buildResult.exitCode).toBe(0);

            const compareResult = await compare(buildDir, expectDir, {
                compareContent: true,
                skipSymlinks: true,
            });

            // check compare result
            expect(compareResult.same).toBe(true);
        });
    });
});
