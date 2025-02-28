import { exec } from 'child_process';
import { error } from 'console';
import esbuild from 'esbuild';

const tsc = exec('tsc -p ./tsconfig.json --noEmit src/', { cwd: process.cwd() });
tsc.stdout.pipe(process.stdout);
tsc.stderr.pipe(process.stderr);

tsc.on('close', (code) => {
    if (code === 0) {
        esbuild
            .build({
                entryPoints: ['src/**/*.ts'],
                bundle: true,
                outdir: 'dist',
                minify: false,
                platform: 'node',
                target: 'ESNext',
                tsconfig: './tsconfig.json',
                format: 'esm',
                packages: 'external',
            })
            .catch(() => {
                error('Error building project');
                process.exit(1);
            });
    } else {
        error('TypeScript compilation failed');
        process.exit(1);
    }
});
