import buildCommand from '@/commands/build.js';
import { Listr } from 'listr2';
import * as env from '@/index.js';
import { existsSync } from 'fs';
import path from 'path';

class SyncCommand extends buildCommand {
    private nobuild: boolean;

    constructor(directories: string[], options: { development: boolean; build: boolean; only: 'behavior' | 'resource' | undefined }) {
        super(directories, options);

        if (this.directories.length === 0) {
            this.directories = super.getAllAddondirectories();
        }

        console.debug('nobuild', options.build);

        this.nobuild = options.build;
    }

    public override async execute(): Promise<void> {
        if (this.nobuild) {
            await super.execute();
        } else {
            const task = new Listr(
                [
                    {
                        title: 'Clearing',
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
                    {
                        title: 'Checking Builded',
                        task: () => this.checkBuilded(),
                    },
                ],
                { concurrent: false }
            );

            await task.run().catch((error) => console.error(error));
        }
    }

    protected checkBuilded(): void {
        this.directories.forEach((directory) => {
            const buildDir = path.join(env.buildDir, 'build', directory);

            if (!existsSync(buildDir)) {
                throw new Error('Builded failed');
            }

            if (this.only === 'behavior') {
                const behaviorDir = path.join(buildDir, 'behavior_packs');

                if (!existsSync(behaviorDir)) {
                    throw new Error('Builded failed');
                }
            } else if (this.only === 'resource') {
                const resourceDir = path.join(buildDir, 'resource_packs');

                if (!existsSync(resourceDir)) {
                    throw new Error('Builded failed');
                }
            } else {
                const behaviorDir = path.join(buildDir, 'behavior_packs');
                const resourceDir = path.join(buildDir, 'resource_packs');

                if (!existsSync(behaviorDir) || !existsSync(resourceDir)) {
                    throw new Error('Builded failed');
                }
            }
        });
    }
}

export default SyncCommand;
