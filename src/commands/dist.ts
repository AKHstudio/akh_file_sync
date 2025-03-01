import BuildCommand from '@/commands/build.js';
import geneleteNbt from '@/helpers/NBT.js';
import * as env from '@/index.js';
import chalk from 'chalk';
import { cpSync, createWriteStream, existsSync, readFileSync } from 'fs';
import { cp } from 'fs/promises';
import { delay, Listr } from 'listr2';
import path from 'path';
import archiver from 'archiver';

class DistCommand extends BuildCommand {
    private type: 'world' | 'addon';
    private setVersion: string;
    private setWorldName: string;

    constructor(directories: string[], options: { setVersion?: string; type: 'world' | 'addon'; setWorldName: string }) {
        super(directories, { development: false, only: undefined });

        this.type = options.type;
        if (options.setVersion) {
            this.setVersion = options.setVersion;
        } else {
            this.setVersion = this.getpackageJsonVersion();
        }
        this.setWorldName = options.setWorldName;

        console.debug('type:', this.type);
        console.debug('setVersion:', this.setVersion);
        console.debug('setWorldName:', this.setWorldName);
    }

    private getpackageJsonVersion(): string {
        try {
            const pk = readFileSync('package.json', 'utf-8');

            const json = JSON.parse(pk);
            return json.version;
        } catch (error) {
            console.error(`❌ [${chalk.red('get package.json version')}]`, chalk.red(`エラーが発生しました:`), error);
            return '1.0.0';
        }
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
                    title: 'Copy to dist',
                    task: () => this.copyToDist(),
                },
                {
                    title: 'dist delay',
                    task: async () => delay(1000),
                },
            ],
            { concurrent: false }
        );

        await task.run().catch((error) => console.error(`❌ [${chalk.red('Copy to dist')}]`, chalk.red(`エラーが発生しました:`), error));

        if (this.type.includes('world')) {
            if (!existsSync(env.worldDir)) {
                throw new Error(`world directory not found: ${env.worldDir}`);
            }

            const task = new Listr(
                [
                    {
                        title: 'Copy world to dist',
                        task: () => this.copyWorld(),
                    },
                    {
                        title: 'generate level.dat',
                        task: () => this.generateLevelDat(),
                    },
                    {
                        title: 'Copy world Packs',
                        task: () => this.copyPacks(),
                    },
                    {
                        title: 'Zip world',
                        task: () => this.zip(path.join(env.distDir, 'world-' + this.setVersion), path.join(env.distDir, 'world' + '-' + this.setVersion + '.mcworld')),
                    },
                ],
                { concurrent: false }
            );

            await task.run().catch((error) => console.error(`❌ [${chalk.red('Copy world to dist')}]`, chalk.red(`エラーが発生しました:`), error));
        }

        if (this.type.includes('addon')) {
            const task = new Listr([
                {
                    title: 'Create mcAddon',
                    task: () => this.createmcAddon(),
                },
            ]);

            await task.run().catch((error) => console.error(`❌ [${chalk.red('Create mcAddon')}]`, chalk.red(`エラーが発生しました:`), error));
        }
    }

    protected createmcAddon() {
        this.directories.forEach(async (directory) => {
            const dist = path.join(env.distDir, directory + '-' + this.setVersion);
            const dest = path.join(env.distDir, directory + '-' + this.setVersion + '.mcaddon');

            await this.zip(dist, dest).catch((error) => {
                console.error(`❌ [${chalk.red('Zip addon')}]`, chalk.red(`エラーが発生しました:`), error);
            });
        });
    }

    protected async generateLevelDat() {
        const world = path.join(env.distDir, 'world' + '-' + this.setVersion);
        const dat = path.join(world, 'level.dat');
        const worldName = this.setWorldName.replace('{name}', path.basename(process.cwd())).replace('{version}', this.setVersion);

        console.debug('world:', world);
        console.debug('dat:', dat);

        if (!existsSync(dat)) {
            throw new Error(`level.dat not found: ${dat}`);
        }

        await geneleteNbt(dat, worldName);
    }

    protected copyToDist(): void {
        this.directories.forEach(async (directory) => {
            const build = path.join(env.buildDir, directory);
            const dist = path.join(env.distDir, directory + '-' + this.setVersion);

            console.debug('build:', build);
            console.debug('dist:', dist);

            await cp(build, dist, { recursive: true, force: true }).catch((error) => {
                console.error(`❌ [${chalk.red('Copy to dist')}]`, chalk.red(`エラーが発生しました:`), error);
            });
        });
    }

    protected async copyWorld() {
        const world = path.join(env.worldDir);
        const dist = path.join(env.distDir, 'world' + '-' + this.setVersion);

        console.debug('world:', world);
        console.debug('dist:', dist);

        await cp(world, dist, { recursive: true, force: true }).catch((error) => {
            console.error(`❌ [${chalk.red('Copy world to dist')}]`, chalk.red(`エラーが発生しました:`), error);
        });
    }

    protected async copyPacks() {
        this.directories.forEach(async (directory) => {
            const behavior_pack = path.join(env.distDir, directory + '-' + this.setVersion, 'behavior_packs');
            const resource_pack = path.join(env.distDir, directory + '-' + this.setVersion, 'resource_packs');
            const worldBehavior_pack = path.join(env.worldDir, 'behavior_packs', directory + '-' + this.setVersion);
            const worldResource_pack = path.join(env.worldDir, 'resource_packs', directory + '-' + this.setVersion);

            cpSync(behavior_pack, worldBehavior_pack, { recursive: true, force: true });

            cpSync(resource_pack, worldResource_pack, { recursive: true, force: true });
        });
    }

    protected async zip(src: string, dest: string): Promise<void> {
        const output = createWriteStream(dest);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        archive.glob('**/*', {
            cwd: src, // ルートディレクトリを指定
        });

        await archive.finalize();

        output.on('close', function () {
            // zip圧縮完了すると発火する
            const archive_size = archive.pointer();
            console.log(`complete! mcaddon total size : ${archive_size} bytes`);
        });
    }
}

export default DistCommand;
