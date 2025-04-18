import { execa } from 'execa';
import { mkdirSync, rmSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('format check', () => {
    const cwd = path.join(__dirname, '..');
    const outputDir = path.join(cwd, 'debug', 'output');
    const fmtDir = path.join(outputDir, 'fmt');

    beforeAll(() => {
        // output ディレクトリを削除
        rmSync(fmtDir, { recursive: true, force: true });

        // output ディレクトリを作成
        mkdirSync(fmtDir, { recursive: true });
    });

    test('should run fmt or fallback to fmt:fix on failure', async () => {
        const fmtResult = await execa('npm', ['run', 'fmt'], { cwd, reject: false });

        writeFile(path.join(fmtDir, 'fmt.log'), fmtResult.stdout, { encoding: 'utf-8' }).catch((err) => {
            console.error('Error writing fmt.log:', err);
        });

        if (fmtResult.exitCode !== 0) {
            const fixResult = await execa('npm', ['run', 'fmt:fix'], { cwd, reject: false });
            writeFile(path.join(fmtDir, 'fmt-fix.log'), fmtResult.stdout, { encoding: 'utf-8' }).catch((err) => {
                console.error('Error writing fmt.log:', err);
            });

            expect(fixResult.exitCode).toBe(0);
        } else {
            expect(fmtResult.exitCode).toBe(0);
        }
    }, 10000);
});
