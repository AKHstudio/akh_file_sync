const tsBaseOptions: CompilerOptions = {
module: ModuleKind.ES2022,
moduleResolution: ModuleResolutionKind.Node10,
lib: ['es2022'],
strict: true,
noImplicitAny: true,
strictNullChecks: true,
target: ScriptTarget.ES2022,
removeComments: true,
allowJs: true,
checkJs: false,
};

const scriptsDirPath = path.posix.join(path.basename(env.srcDir), directory, 'behavior_packs', 'scripts');

// console.log('scriptsDirPath: ', scriptsDirPath);

const dirs = await glob(`${scriptsDirPath}/**/*/`, { posix: true });

// console.log('dirs: ', dirs);

if (dirs.length === 0) {
cliBar.increment();
console.log('ℹ️', ' ', `[${chalk.blue('compile scripts')}]`, chalk.yellow(`処理をスキップしました:`), directory);
return;
}

const filteredDirs = dirs.filter(async (dir) => {
const files = await glob(`${dir}/*.{ts,js}`, { nodir: true, posix: true, ignore: `${dir}/*.d.ts` });
return files.length > 0;
});

// console.log('filteredDirs: ', filteredDirs);

filteredDirs.forEach(async (dir) => {
const files = await glob(`${dir}/*.{ts,js}`, {
nodir: true,
posix: true,
ignore: `${dir}/*.d.ts`,
});
// console.log('files: ', files);

    const Diagnostics: Diagnostic[] = [];

    const tsOptions: CompilerOptions = {
        ...tsBaseOptions,
        outDir: path.join(env.buildDir, directory, 'behavior_packs', 'scripts'),
        sourceMap: Boolean(this.dev),
        inlineSources: Boolean(this.dev),
    };

    // console.log('tsOptions: ', tsOptions);

    const program = createProgram(files, tsOptions);
    const emitResult = program.emit();

    // console.log('emitResult: ', emitResult);

    const allDiagnostics = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    Diagnostics.push(...allDiagnostics);

});
