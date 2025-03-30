import buildCommand from '@/commands/build.js';
import { delay, Listr } from 'listr2';
import * as env from '@/index.js';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { cp } from 'fs/promises';

class SyncCommand extends buildCommand {
    private build: boolean;

    constructor(directories: string[], options: { development: boolean; build: boolean; only: 'behavior' | 'resource' | undefined }) {
        super(directories, options);

        if (this.directories.length === 0) {
            this.directories = super.getAllAddondirectories();
        }

        // console.debug('build', options.build);

        this.build = options.build;
    }

    public override async execute(): Promise<void> {
        if (this.build) {
            await super.execute();

            await this.syncTask();
        } else {
            const task = new Listr(
                [
                    {
                        title: 'Clearing Sync Target',
                        task: () => {
                            if (this.only === 'behavior') {
                                super.clearSyncTargetDir(this.only);
                            } else if (this.only === 'resource') {
                                super.clearSyncTargetDir(this.only);
                            } else {
                                super.clearSyncTargetDir('behavior');
                                super.clearSyncTargetDir('resource');
                            }
                        },
                    },
                ],
                { concurrent: false },
            );

            await task
                .run()
                .then(async () => {
                    await this.syncTask();
                })
                .catch((error) => {
                    console.error(`❌ [${chalk.red('Check Builded')}]`, chalk.red(`エラーが発生しました:`), error);

                    if (error.message === 'Builded failed') {
                        console.warn('ℹ️', `[${chalk.green('Check Builded')}]`, chalk.yellow(`ビルドが完了していません。`));
                    }
                });
        }
    }

    protected async syncTask(): Promise<void> {
        const syncTask = new Listr(
            [
                {
                    title: 'Build delay',
                    task: async () => await delay(1000),
                },
                {
                    title: 'Checking Builded',
                    task: () => this.checkBuilded(),
                },
                {
                    title: 'Syncing',
                    task: () => {
                        if (this.only === 'behavior') {
                            this.runSync('behavior');
                        } else if (this.only === 'resource') {
                            this.runSync('resource');
                        } else {
                            this.runSync('behavior');
                            this.runSync('resource');
                        }
                    },
                },
            ],
            { concurrent: false },
        );

        await syncTask.run().catch((error) => console.error(error));
    }

    protected checkBuilded(): void {
        this.directories.forEach((directory) => {
            const buildDir = path.join(env.buildDir, directory);
            const srcDir = path.join(env.srcDir, directory);

            if (!existsSync(buildDir)) {
                throw new Error(`Builded failed (no build directory ${buildDir})`);
            }

            if (this.only === 'behavior') {
                const behaviorDir = path.join(buildDir, 'behavior_packs');
                const behaviorSrcDir = path.join(srcDir, 'behavior_packs');

                if (!existsSync(behaviorDir) && existsSync(behaviorSrcDir)) {
                    throw new Error(`Builded failed (no behavior directory ${behaviorDir})`);
                }
            } else if (this.only === 'resource') {
                const resourceDir = path.join(buildDir, 'resource_packs');
                const resourceSrcDir = path.join(srcDir, 'resource_packs');

                if (!existsSync(resourceDir) && existsSync(resourceSrcDir)) {
                    throw new Error(`Builded failed (no resource directory ${resourceDir})`);
                }
            } else {
                const behaviorDir = path.join(buildDir, 'behavior_packs');
                const resourceDir = path.join(buildDir, 'resource_packs');
                const behaviorSrcDir = path.join(srcDir, 'behavior_packs');
                const resourceSrcDir = path.join(srcDir, 'resource_packs');

                if ((!existsSync(behaviorDir) && existsSync(behaviorSrcDir)) || (!existsSync(resourceDir) && existsSync(resourceSrcDir))) {
                    throw new Error(`Builded failed (no behavior or resource directory ${behaviorDir} or ${resourceDir})`);
                }
            }
        });
    }

    protected async runSync(type: 'behavior' | 'resource') {
        this.directories.forEach((directory) => {
            const buildDir = path.join(env.buildDir, directory, `${type}_packs`);
            const srcDir = path.join(env.srcDir, directory, `${type}_packs`);
            const syncTargetDir = path.join(env.syncTargetDir, `development_${type}_packs`, `${env.akhsyncFlag}-${directory}`);

            if (!existsSync(srcDir)) return;

            cp(buildDir, syncTargetDir, { recursive: true, force: true }).catch((err) => {
                console.error(`❌ [${chalk.red(`Sync target ${type} ${directory}`)}]`, chalk.red(`エラーが発生しました:`), err);
            });
        });
    }
}

export default SyncCommand;
