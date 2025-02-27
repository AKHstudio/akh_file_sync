import * as env from '@/index.js';
import { cp, rm } from 'fs/promises';
import { Presets, SingleBar } from 'cli-progress';
import chalk from 'chalk';
import path from 'path';
import { glob, globSync } from 'glob';
import { exit } from 'process';
import checkDirectoryExists from '@/helpers/checkDirectoryExists.js';
import { CompilerOptions, createProgram, Diagnostic, getPreEmitDiagnostics, ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';
import { error } from 'console';

class BuildCommand {
    private directorys: string[];
    private dev: boolean;
    private only: 'behavior' | 'resource' | undefined;

    /**
     *  build command class
     */
    constructor(directorys: string[], options: { development: boolean; only: 'behavior' | 'resource' | undefined }) {
        this.directorys = directorys;
        this.dev = options.development;
        this.only = options.only;

        if (this.directorys.length === 0) {
            this.directorys = this.getAllAddonDirectorys();
        }

        console.log('Directorys: ', this.directorys);
        console.log('Development: ', this.dev);
        console.log('Only: ', this.only);
    }

    public async execute() {
        await this.clear();
        // console.log('Cleared!');
        await this.copy();
    }

    /**
     * srcディレクトリ配下にある全てのアドオンディレクトリを取得する
     * @returns all addon directorys
     */
    private getAllAddonDirectorys(): string[] {
        try {
            const directorys = globSync(env.srcDir + '/*/', { posix: true });
            const DirNames = directorys.map((directory) => path.basename(directory));
            return DirNames;
        } catch (err) {
            console.error(err);
            exit(1);
        }
    }

    private async clear() {
        if (this.only === 'behavior') {
            this.clearSyncTargetDir(this.only);
        } else if (this.only === 'resource') {
            this.clearSyncTargetDir(this.only);
        } else {
            this.clearSyncTargetDir('behavior');
            this.clearSyncTargetDir('resource');
        }

        this.clearOldSyncedBuildDir(this.only);
    }

    private async copy() {
        this.cpSrcDirToBuildDir(this.only);

        if (this.only === 'behavior' || this.only === undefined) {
            this.cpScriptsDirToBuildDir();
        }
    }

    public clearSyncTargetDir(type: 'behavior' | 'resource') {
        const cliBar = new SingleBar(
            {
                format: `{check} Clearing target directory ${type} {dirname} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
                hideCursor: true,
                stream: process.stdout,
            },
            Presets.legacy
        );

        cliBar.start(this.directorys.length, 0, { check: '⌛' });

        const DevDirPath = path.join(env.syncTargetDir, `development_${type}_packs`);

        // console.log(DevresourceDirPath);

        const promises = this.directorys.map(async (directory) => {
            cliBar.update({ dirname: chalk.blue(directory) });

            rm(`${DevDirPath}/${env.akhsyncFlag}-${directory}`, { recursive: true }).catch(() => {
                console.log('ℹ️', ' ', `[${chalk.blue(`Clear target ${type}`)}]`, chalk.yellow(`処理をスキップしました:`), directory);
            });

            cliBar.increment();
        });

        Promise.all(promises).then(() => {
            cliBar.update({ check: '✅' });
            cliBar.update({ dirname: chalk.green('Complete!') });
            cliBar.stop();
        });
    }

    public clearOldSyncedBuildDir(only: typeof this.only) {
        const cliBar = new SingleBar(
            {
                format: `{check} Clearing old builds {dirname} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
                hideCursor: true,
                stream: process.stdout,
            },
            Presets.legacy
        );

        cliBar.start(this.directorys.length, 0, { check: '⌛' });

        const promises = this.directorys.map(async (directory) => {
            cliBar.update({ dirname: chalk.blue(directory) });

            const rmTargetDir = path.join(env.buildDir, directory);

            if (only === undefined) {
                rm(rmTargetDir, { recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Clear old builds')}]`, chalk.yellow(`処理をスキップしました:`), directory);
                });
            } else {
                rm(`${rmTargetDir}/${only}_packs`, { recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Clear old builds')}]`, chalk.yellow(`処理をスキップしました:`), directory);
                });
            }

            cliBar.increment();
        });

        Promise.all(promises).then(() => {
            cliBar.update({ check: '✅' });
            cliBar.update({ dirname: chalk.green('Complete!') });
            cliBar.stop();
        });
    }

    public cpSrcDirToBuildDir(only: typeof this.only) {
        const cliBar = new SingleBar(
            {
                format: `{check} Copying {dirname} to build directory [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
                hideCursor: true,
                stream: process.stdout,
            },
            Presets.legacy
        );

        cliBar.start(this.directorys.length, 0, { check: '⌛' });

        const promises = this.directorys.map(async (directory) => {
            cliBar.update({ dirname: chalk.blue(directory) });

            const srcDir = path.join(env.srcDir, directory);
            const destDir = path.join(env.buildDir, directory);

            const cpFilter = async (src: string) => {
                if (await checkDirectoryExists(src)) {
                    if (path.basename(src) === 'scripts') {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            };

            if (only === undefined) {
                cp(srcDir, destDir, { filter: cpFilter, recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory);
                });
            } else {
                cp(`${srcDir}/${only}_packs`, `${destDir}/${only}_packs`, { filter: cpFilter, recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory);
                });
            }

            cliBar.increment();
        });

        Promise.all(promises).then(() => {
            cliBar.update({ check: '✅' });
            cliBar.update({ dirname: chalk.green('Complete!') });
            cliBar.stop();
        });
    }

    public cpScriptsDirToBuildDir() {
        const cliBar = new SingleBar(
            {
                format: `{check} Copying {dirname} to build scripts directory [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
                hideCursor: true,
                stream: process.stdout,
            },
            Presets.legacy
        );

        cliBar.start(this.directorys.length, 0, { check: '⌛' });

        const promises = this.directorys.map(async (directory) => {
            const destDir = path.join(env.buildDir, directory);

            const scriptsDirPath = path.posix.join(path.basename(env.srcDir), directory, 'behavior_packs', 'scripts');

            // console.log(scriptsDirPath);

            const files = await glob(`${scriptsDirPath}/**/*`, {
                posix: true,
                nodir: true,
                ignore: `${scriptsDirPath}/**/*.{ts,js}`,
            });

            files.forEach((file) => {
                // console.log('file: ', file);

                const filePath = path.join(destDir, 'behavior_packs', 'scripts', file.slice(file.indexOf('scripts') + 8));

                cp(file, filePath, { recursive: true }).catch((err) => {
                    error('Error: ', err);
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build scripts')}]`, chalk.yellow(`処理をスキップしました:`), file);
                });

                cliBar.increment();
            });
        });

        Promise.all(promises).then(() => {
            cliBar.update({ check: '✅' });
            cliBar.update({ dirname: chalk.green('Complete!') });
            cliBar.stop();

            this.compileScripts();
        });
    }

    public compileScripts() {
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

        const cliBar = new SingleBar(
            {
                format: `{check} compiling scripts {dirname} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
                hideCursor: true,
                stream: process.stdout,
            },
            Presets.legacy
        );

        cliBar.start(this.directorys.length, 0, { check: '⌛', filename: chalk.blue('') });

        this.directorys.forEach(async (directory) => {
            cliBar.update({ dirname: chalk.blue(directory) });

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

            cliBar.increment();
        });
        cliBar.update({ check: '✅' });
        cliBar.update({ filename: chalk.green('Complete!') });
        cliBar.stop();
    }
}

export default BuildCommand;
