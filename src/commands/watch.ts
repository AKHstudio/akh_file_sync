import SyncCommand from '@/commands/sync.js';
import chokidar from 'chokidar';
import path from 'path';
import * as env from '@/index.js';

class WatchCommand extends SyncCommand {
    private watchDirectories: string[];
    private watchDelay: number = 2000; // Delay in milliseconds
    private isWatchDelaying: boolean = false;

    constructor(directories: string[], options: { development: boolean; build: boolean; only: 'behavior' | 'resource' | undefined }) {
        super(directories, options);

        this.watchDirectories = this.directories.map((directory) => path.join(env.srcDir, directory));
    }

    public override async execute() {
        console.log('Watching...', this.watchDirectories);
        chokidar.watch(this.watchDirectories).on('change', async (path) => {
            if (this.isWatchDelaying) {
                console.log('🟡 Watch is delaying, skipping change:', path);
                return;
            }

            console.log('🟢 change', path);
            this.isWatchDelaying = true; // Set the flag to true to prevent further changes from being processed immediately
            await super.execute();
            console.log('🔄 Sync completed');

            new Promise((resolve) => {
                setTimeout(() => {
                    this.isWatchDelaying = false;
                    resolve(true);
                }, this.watchDelay);
            }); // Delay to prevent rapid changes
        });

        process.on('SIGINT', () => {
            console.log('Goodbye!');
            process.exit(0);
        });
    }
}

export default WatchCommand;
