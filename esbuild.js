import esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['src/*.ts'],
        bundle: true,
        outdir: 'dist',
        minify: false,
        platform: 'node',
        target: 'ESNext',
        tsconfig: './tsconfig.json',
        format: 'esm',
        packages: 'external',
    })
    .catch(() => process.exit(1));
