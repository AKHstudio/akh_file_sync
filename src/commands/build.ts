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

        console.debug('🛠️ ', 'directories: ', this.directories);
        console.debug('🛠️ ', 'Development: ', this.dev);
        console.debug('🛠️ ', 'Only: ', this.only);
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
                            { concurrent: true, rendererOptions: { collapseSubtasks: false } },
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
            { concurrent: false },
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
            { concurrent: true },
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
                console.warn('ℹ️', ` [${chalk.green(`Clear target ${type}`)}]`, chalk.yellow(`処理をスキップしました:`), path.basename(rmTargetDir));
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

            const tsconfigFiles = await glob(`./tsconfig.json`, {
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

            console.debug('🛠️ ', 'tsconfigFlag: ', tsconfigFlag);
            console.debug('🛠️ ', 'tsconfig: ', tsconfig);
            console.debug('🛠️ ', 'tsconfigFiles: ', tsconfigFiles);

            // console.debug("🛠️",'esbuildOptions: ', {
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

            interface IncludeOnlyOptions {
                /**
                 * 含める（バンドルする）パスのパターンの配列
                 * 例: ['~/*', '@/*', './internal/*']
                 */
                include: string[];
            }

            /**
             * 指定したパスパターンのみをバンドルに含めるesbuildプラグイン
             */
            const includeOnlyPlugin = (options: IncludeOnlyOptions): esbuild.Plugin => {
                return {
                    name: 'include-only',
                    setup(build: esbuild.PluginBuild) {
                        const { include } = options;

                        // パターンを正規表現に変換
                        const includeRegexes = include.map((pattern) => {
                            // glob パターンを正規表現に変換
                            const regexPattern = pattern
                                .replace(/\*/g, '.*') // * を .* に変換
                                .replace(/\?/g, '.') // ? を . に変換
                                .replace(/\//g, '\\/'); // / をエスケープ

                            return new RegExp(`^${regexPattern}`);
                        });

                        console.debug('🛠️ ', 'Include regexes:', includeRegexes);

                        // インポートパスの解決をフック
                        build.onResolve({ filter: /.*/ }, (args) => {
                            const importPath = args.path;
                            // console.debug('🛠️ ', 'Resolving import path:', importPath);
                            const importer = args.importer;
                            // console.debug('🛠️ ', 'Importer:', importer);

                            // エントリーポイントは常にバンドルに含める
                            if (args.kind === 'entry-point') {
                                return; // デフォルトの解決に委ねる
                            }

                            // 含めるパターンにマッチするかチェック
                            const shouldInclude = includeRegexes.some((regex) => regex.test(importPath));
                            // importerにnode_modules/@minecraft/mathが含まれている場合は、バンドルに残す
                            if (/node_modules[/\\]@minecraft[/\\]math/.test(importer)) {
                                return;
                            }

                            if (shouldInclude) {
                                // その他のパスはそのまま処理を続行
                                return;
                            }

                            console.debug('🛠️ ', 'Skipping import path:', importPath);

                            if (!importPath.startsWith('.') && !importPath.startsWith('@')) {
                                // 呼び出し元ファイルのディレクトリ
                                const importerDir = path.dirname(importer);

                                // 相対パスとして組み直す
                                const fullPath = path.relative(importerDir, importPath).replace(/\\/g, '/'); // WindowsのパスをPOSIX形式に変換

                                console.debug('🛠️ ', 'Including import path:', fullPath);

                                return { path: fullPath, external: true }; // 絶対パスを返す
                            }

                            // 含めないパターンの場合は external として扱う
                            return {
                                path: importPath,
                                external: true,
                            };
                        });
                    },
                };
            };

            // prettier-ignore
            await esbuild
                .build({
                    entryPoints: [...scriptFiles],
                    bundle: true,
                    outdir: outdir,
                    minify: Boolean(!this.dev),
                    sourcemap: Boolean(this.dev),
                    sourceRoot: path.join("src", directory, 'behavior_packs', 'scripts'),
                    platform: "node",
                    target: "node18",
                    ...(tsconfigFlag ? { tsconfig: tsconfig } : {}),
                    format: 'esm',
                    external: [
                        "@minecraft/server",
                        "@minecraft/server-ui",
                        "@minecraft/server-admin",
                        "@minecraft/server-gametest",
                        "@minecraft/server-net",
                        "@minecraft/server-common",
                        "@minecraft/server-editor",
                        "@minecraft/debug-utilities",
                    ],
                    plugins :[
                        includeOnlyPlugin({
                            include: ["@minecraft/vanilla-data" , "@minecraft/math"]
                        }),
                    ]
                })
                .catch(() => {
                    error('Error building project');
                    process.exit(1);
                });
        });
    }
}

export default BuildCommand;
