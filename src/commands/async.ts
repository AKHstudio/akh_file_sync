import BuildCommand from '@/commands/build.js';
import { Listr } from 'listr2';

class AsyncCommand extends BuildCommand {
    protected directories: string[];

    constructor(directories: string[], options: { only: 'behavior' | 'resource' | undefined }) {
        super(directories, { development: false, only: options.only });

        this.directories = directories;

        if (this.directories.length === 0) {
            this.directories = super.getAllAddondirectories();
        }
    }

    public override async execute() {
        const asyncTask = new Listr(
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
            ],
            { concurrent: true }
        );
        await asyncTask.run().catch((err) => console.error(err));
    }
}

export default AsyncCommand;
