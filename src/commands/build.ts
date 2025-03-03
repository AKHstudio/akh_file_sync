import * as env from '@/index.js';
import { rmSync } from 'fs';
import { cp, mkdir, rm } from 'fs/promises';
import chalk from 'chalk';
import path from 'path';
import { glob, globSync } from 'glob';
import { exit } from 'process';
import checkDirectoryExists from '@/helpers/checkDirectoryExists.js';
import { error } from 'console';
import esbuild from 'esbuild';
import { Listr } from 'listr2';

class BuildCommand {
    protected directories: string[];
    protected dev: boolean;
    protected only: 'behavior' | 'resource' | undefined;

    /**
     *  build command class
     */
    constructor(directories: string[], options: { development: boolean; only: 'behavior' | 'resource' | undefined }) {
        this.directories = directories;
        this.dev = options.development;
        this.only = options.only;

        if (this.directories.length === 0) {
            this.directories = this.getAllAddondirectories();
        }

        // console.debug('directories: ', this.directories);
        // console.debug('Development: ', this.dev);
        // console.debug('Only: ', this.only);
    }

    public async execute() {
        const clear_copy = new Listr(
            [
                {
                    title: 'Clearing',
                    task: (_, task): Listr =>
                        task.newListr(
                            [
                                {
                                    title: 'Clearing Sync Target Directory',
                                    task: () => {
                                        if (this.only === 'behavior') {
                                            this.clearSyncTargetDir(this.only);
                                        } else if (this.only === 'resource') {
                                            this.clearSyncTargetDir(this.only);
                                        } else {
                                            this.clearSyncTargetDir('behavior');
                                            this.clearSyncTargetDir('resource');
                                        }
                                    },
                                },
                                {
                                    title: 'Clearing old synced build directory',
                                    task: () => this.clearOldSyncedBuildDir(this.only),
                                },
                            ],
                            { concurrent: true, rendererOptions: { collapseSubtasks: false } }
                        ),
                },
                {
                    title: 'Copying',
                    task: (_, task) =>
                        task.newListr([
                            {
                                title: 'Copying src directory to build directory',
                                task: () => this.cpSrcDirToBuildDir(this.only),
                            },
                        ]),
                },
            ],
            { concurrent: false }
        );

        const compile_scripts = new Listr(
            [
                {
                    title: 'Copying scripts directory to build directory ignoring .ts and .js files',
                    task: () => this.cpScriptsDirToBuildDir(),
                },
                {
                    title: 'Compiling scripts',
                    task: () => this.compileScripts(),
                },
            ],
            { concurrent: true }
        );

        await clear_copy.run().catch((err) => console.error(err));

        if (this.only === 'behavior' || this.only === undefined) {
            await compile_scripts.run().catch((err) => console.error(err));
        }
    }

    /**
     * srcディレクトリ配下にある全てのアドオンディレクトリを取得する
     * @returns all addon directories
     */
    protected getAllAddondirectories(): string[] {
        try {
            const directories = globSync(env.srcDir + '/*/', { posix: true });
            const DirNames = directories.map((directory) => path.basename(directory));
            return DirNames;
        } catch (err) {
            console.error(err);
            exit(1);
        }
    }

    public clearSyncTargetDir(type: 'behavior' | 'resource') {
        const DevDirPath = path.join(env.syncTargetDir, `development_${type}_packs`);

        const promises = this.directories.map(async (directory) => {
            const rmTargetDir = path.join(DevDirPath, `${env.akhsyncFlag}-${directory}`);

            rm(rmTargetDir, { recursive: true }).catch(() => {
                console.warn('ℹ️', ` [${chalk.green(`Clear target ${type}`)}]`, chalk.yellow(`処理をスキップしました:`), rmTargetDir);
                console.info('💡', `[${chalk.blue('info')}] ディレクトリが存在しないまたはゲームを起動中の可能性があります。`);
            });
        });

        Promise.all(promises);
    }

    public clearOldSyncedBuildDir(only: typeof this.only) {
        const promises = this.directories.map(async (directory) => {
            const rmTargetDir = path.join(env.buildDir, directory);

            if (only === undefined) {
                try {
                    rmSync(rmTargetDir, { recursive: true, force: true });
                } catch {
                    // console.error(err);

                    console.warn('ℹ️', ' ', `[${chalk.blue('Clear old builds')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (rm)');
                    console.info('💡', `[${chalk.blue('info')}] ディレクトリが存在しない可能性があります。`);
                }
            } else {
                try {
                    rmSync(`${rmTargetDir}/${only}_packs`, { recursive: true, force: true });
                } catch {
                    // console.error(err);

                    console.warn('ℹ️', ' ', `[${chalk.blue('Clear old builds')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (rm)');
                    console.info('💡', `[${chalk.blue('info')}] ディレクトリが存在しない可能性があります。`);
                }
            }
        });

        Promise.all(promises);
    }

    public cpSrcDirToBuildDir(only: typeof this.only) {
        const promises = this.directories.map(async (directory) => {
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
                await mkdir(destDir, { recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (mkdir)');
                });

                await cp(srcDir, destDir, { filter: cpFilter, recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (cp)');
                });
            } else {
                await mkdir(`${destDir}/${only}_packs`, { recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (mkdir)');
                });

                await cp(`${srcDir}/${only}_packs`, `${destDir}/${only}_packs`, { filter: cpFilter, recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build')}]`, chalk.yellow(`処理をスキップしました:`), directory + ' (cp)');
                });
            }
        });

        Promise.all(promises);
    }

    public cpScriptsDirToBuildDir() {
        const promises = this.directories.map(async (directory) => {
            const destDir = path.join(env.buildDir, directory);

            const scriptsDirPath = path.posix.join(path.basename(env.srcDir), directory, 'behavior_packs', 'scripts');

            const files = await glob(`${scriptsDirPath}/**/*`, {
                posix: true,
                nodir: true,
                ignore: `${scriptsDirPath}/**/*.{ts,js}`,
            });

            files.forEach(async (file) => {
                const filePath = path.join(destDir, 'behavior_packs', 'scripts', file.slice(file.indexOf('scripts') + 8));

                await mkdir(path.dirname(filePath), { recursive: true }).catch(() => {
                    console.log('ℹ️', ' ', `[${chalk.blue('Copy to build scripts')}]`, chalk.yellow(`処理をスキップしました:`), file + ' (mkdir)');
                });
            });
        });

        Promise.all(promises);
    }

    public compileScripts() {
        this.directories.forEach(async (directory) => {
            const entry = path.posix.join(path.basename(env.srcDir), directory, 'behavior_packs', 'scripts');
            const outdir = path.posix.join(path.basename(env.buildDir), directory, 'behavior_packs', 'scripts');

            const tsconfigFiles = await glob(`./**/tsconfig.json`, {
                posix: true,
                nodir: true,
                ignore: [path.posix.join('node_modules', '**', 'tsconfig.json'), path.posix.join('**', 'behavior_packs', '**', 'tsconfig.json')],
            });

            const tsconfigFlag = tsconfigFiles.length > 0;
            const tsconfig = tsconfigFlag ? path.resolve(tsconfigFiles[0]) : undefined;

            const scriptFiles = await glob(`${entry}/**/*.{ts,js}`, {
                posix: true,
                nodir: true,
                ignore: `${entry}/**/*.d.ts`,
            });

            // console.debug('tsconfigFlag: ', tsconfigFlag);
            // console.debug('tsconfig: ', tsconfig);
            // console.debug('tsconfigFiles: ', tsconfigFiles);

            // console.debug('esbuildOptions: ', {
            //     entryPoints: [...scriptFiles],
            //     bundle: false,
            //     outdir: outdir,
            //     minify: Boolean(!this.dev),
            //     sourcemap: Boolean(this.dev),
            //     sourceRoot: path.join(env.srcDir, directory, 'behavior_packs', 'scripts'),
            //     platform: 'node',
            //     target: 'ESNext',
            //     ...(tsconfigFlag ? { tsconfig: tsconfig } : {}),
            //     format: 'esm',
            //     packages: 'external',
            // });

            await esbuild
                .build({
                    entryPoints: [...scriptFiles],
                    bundle: false,
                    outdir: outdir,
                    minify: Boolean(!this.dev),
                    sourcemap: Boolean(this.dev),
                    sourceRoot: path.join(env.srcDir, directory, 'behavior_packs', 'scripts'),
                    platform: 'node',
                    target: 'ESNext',
                    ...(tsconfigFlag ? { tsconfig: tsconfig } : {}),
                    format: 'esm',
                    packages: 'external',
                })
                .catch(() => {
                    error('Error building project');
                    process.exit(1);
                });
        });
    }
}

export default BuildCommand;
