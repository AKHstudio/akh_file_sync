import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { cp } from 'fs/promises';
import path from 'path';

import archiver from 'archiver';
import chalk from 'chalk';
import { delay, Listr } from 'listr2';

import BuildCommand from '@/commands/build.js';
import generateNbt from '@/helpers/NBT.js';
import * as env from '@/index.js';

class DistCommand extends BuildCommand {
    private type: 'world' | 'addon';
    private setVersion: string;
    private setWorldName: string;
    private setWorldDirectoryName: string;

    constructor(directories: string[], options: { setVersion?: string; type: 'world' | 'addon'; setWorldName: string }) {
        super(directories, { development: false, debug: false, only: undefined });

        this.type = options.type;
        if (options.setVersion) {
            this.setVersion = options.setVersion;
        } else {
            this.setVersion = this.getPackageJsonVersion();
        }
        this.setWorldName = options.setWorldName;
        this.setWorldDirectoryName = `${this.getPackageJsonName()}-world-${this.setVersion}`;

        console.debug('🛠️ ', 'type:', this.type);
        console.debug('🛠️ ', 'setVersion:', this.setVersion);
        console.debug('🛠️ ', 'setWorldName:', this.setWorldName);
    }

    private getPackageJsonVersion(): string {
        try {
            const pk = readFileSync('package.json', 'utf-8');

            const json = JSON.parse(pk);
            return json.version;
        } catch (error) {
            console.error(`❌ [${chalk.red('get package.json version')}]`, chalk.red(`エラーが発生しました:`), error);
            return '1.0.0';
        }
    }

    private getPackageJsonName(): string {
        try {
            const pk = readFileSync('package.json', 'utf-8');

            const json = JSON.parse(pk);
            return json.name;
        } catch (error) {
            console.error(`❌ [${chalk.red('get package.json version')}]`, chalk.red(`エラーが発生しました:`), error);
            return 'world';
        }
    }

    private checkWorldDirectory(): boolean {
        let isWorldValid = true;

        const expectedFilesAndDirs = ['level.dat', 'db', 'behavior_packs', 'resource_packs'];

        for (const item of expectedFilesAndDirs) {
            const itemPath = path.join(env.worldDir, item);
            if (!existsSync(itemPath)) {
                console.error(`❌ [${chalk.red('check world directory')}]`, chalk.red(`world directory is missing required item: ${item}`));
                isWorldValid = false;
            }
        }

        return isWorldValid;
    }

    public override async execute() {
        await super.execute();

        const task = new Listr(
            [
                {
                    title: 'build delay',
                    task: async () => delay(1000),
                },
                {
                    title: 'Clear old dist',
                    task: () => this.clearOldDist(),
                },
                {
                    title: 'Copy to dist',
                    task: async () => await this.copyToDist(),
                },
            ],
            { concurrent: false },
        );

        await task.run().catch((error) => console.error(`❌ [${chalk.red('Copy to dist')}]`, chalk.red(`エラーが発生しました:`), error));

        if (this.type.includes('world')) {
            if (!existsSync(env.worldDir)) {
                console.error(`❌ [${chalk.red('check world directory')}]`, chalk.red(`world directory does not exist: ${env.worldDir}`));
                console.info('💡', `[${chalk.blue('info')}] worldディレクトリが存在するか確認してください。`);
                console.info('💡', `[${chalk.blue('info')}] 基本的にworldディレクトリは ${path.join(env.syncTargetDir, 'minecraftWorlds')} 配下に存在しています`);
                process.exit(1);
            } else if (!this.checkWorldDirectory()) {
                console.error(`❌ [${chalk.red('check world directory')}]`, chalk.red(`world directory is missing required files or directories.`));
                console.info('💡', `[${chalk.blue('info')}] worldディレクトリ内にlevel.dat、db、behavior_packs、resource_packsが存在するか確認してください。`);
                console.info('💡', `[${chalk.blue('info')}] 基本的にworldディレクトリは ${path.join(env.syncTargetDir, 'minecraftWorlds')} 配下に存在しています`);
                process.exit(1);
            }

            const task = new Listr(
                [
                    {
                        title: 'Copy world to dist',
                        task: async () => await this.copyWorld(),
                    },
                    {
                        title: 'generate level.dat',
                        task: async () => await this.generateLevelDat(),
                    },
                    {
                        title: 'Copy world Packs',
                        task: async () => await this.copyPacks(),
                    },
                    {
                        title: 'Zip world',
                        task: () => this.zip(path.join(env.distDir, this.setWorldDirectoryName), path.join(env.distDir, this.setWorldDirectoryName + '.mcworld')),
                    },
                ],
                { concurrent: false },
            );

            await task.run().catch((error) => console.error(`❌ [${chalk.red('Copy world to dist')}]`, chalk.red(`エラーが発生しました:`), error));
        }

        if (this.type.includes('addon')) {
            const task = new Listr([
                {
                    title: 'Create mcAddon',
                    task: () => this.createMcAddon(),
                },
            ]);

            await task.run().catch((error) => console.error(`❌ [${chalk.red('Create mcAddon')}]`, chalk.red(`エラーが発生しました:`), error));
        }
    }

    protected createMcAddon() {
        this.directories.forEach(async (directory) => {
            const addonDirName = `${directory}-${this.setVersion}`;
            const dist = path.join(env.distDir, addonDirName);
            const dest = path.join(env.distDir, addonDirName + '.mcaddon');

            await this.zip(dist, dest).catch((error) => {
                console.error(`❌ [${chalk.red('Zip addon')}]`, chalk.red(`エラーが発生しました:`), error);
            });
        });
    }

    protected async generateLevelDat() {
        const world = path.join(env.distDir, this.setWorldDirectoryName);
        const dat = path.join(world, 'level.dat');
        const worldName = this.setWorldName.replace('{name}', path.basename(process.cwd())).replace('{version}', this.setVersion);

        console.debug('🛠️ ', 'world:', world);
        console.debug('🛠️ ', 'dat:', dat);

        if (!existsSync(dat)) {
            throw new Error(`level.dat not found: ${dat}`);
        }

        await generateNbt(dat, worldName);
    }

    protected clearOldDist(): void {
        rmSync(env.distDir, { recursive: true, force: true });

        mkdirSync(env.distDir, { recursive: true });
    }

    protected async copyToDist(): Promise<void> {
        await Promise.all(
            this.directories.map(async (directory) => {
                const build = path.join(env.buildDir, directory);
                const dist = path.join(env.distDir, directory + '-' + this.setVersion);

                console.debug('🛠️ ', 'build:', build);
                console.debug('🛠️ ', 'dist:', dist);

                await cp(build, dist, { recursive: true, force: true }).catch((error) => {
                    console.error(`❌ [${chalk.red('Copy to dist')}]`, chalk.red(`エラーが発生しました:`), error);
                });
            }),
        );
    }

    protected async copyWorld() {
        const world = path.join(env.worldDir);
        const dist = path.join(env.distDir, this.setWorldDirectoryName);

        console.debug('🛠️ ', 'world', world);
        console.debug('🛠️ ', 'dist:', dist);

        await cp(world, dist, { recursive: true, force: true }).catch((error) => {
            console.error(`❌ [${chalk.red('Copy world to dist')}]`, chalk.red(`エラーが発生しました:`), error);
        });
    }

    protected async copyPacks() {
        await Promise.all(
            this.directories.map(async (directory) => {
                const behavior_pack = path.join(env.distDir, directory + '-' + this.setVersion, 'behavior_packs');
                const resource_pack = path.join(env.distDir, directory + '-' + this.setVersion, 'resource_packs');
                const worldBehavior_pack = path.join(env.distDir, this.setWorldDirectoryName, 'behavior_packs', directory + '-' + this.setVersion);
                const worldResource_pack = path.join(env.distDir, this.setWorldDirectoryName, 'resource_packs', directory + '-' + this.setVersion);

                console.debug('🛠️ ', 'behavior_pack:', behavior_pack);
                console.debug('🛠️ ', 'resource_pack:', resource_pack);
                console.debug('🛠️ ', 'worldBehavior_pack:', worldBehavior_pack);
                console.debug('🛠️ ', 'worldResource_pack:', worldResource_pack);

                if (existsSync(behavior_pack)) {
                    await cp(behavior_pack, worldBehavior_pack, { recursive: true, force: true }).catch((error) => {
                        console.error(`❌ [${chalk.red('Copy behavior pack')}]`, chalk.red(`エラーが発生しました:`), error);
                    });
                }

                if (existsSync(resource_pack)) {
                    await cp(resource_pack, worldResource_pack, { recursive: true, force: true }).catch((error) => {
                        console.error(`❌ [${chalk.red('Copy resource pack')}]`, chalk.red(`エラーが発生しました:`), error);
                    });
                }
            }),
        );
    }

    protected async zip(src: string, dest: string): Promise<void> {
        const output = createWriteStream(dest);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        archive.directory(src, false);

        await archive.finalize();

        output.on('close', function () {
            // zip圧縮完了すると発火する
            const archive_size = archive.pointer();
            console.log(`✅ complete! mcaddon total size : ${archive_size} bytes`, path.basename(dest));
        });
    }
}

export default DistCommand;
