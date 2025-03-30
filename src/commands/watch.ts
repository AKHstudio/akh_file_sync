import SyncCommand from '@/commands/sync.js';
import chokidar from 'chokidar';
import path from 'path';
import * as env from '@/index.js';

class WatchCommand extends SyncCommand {
    private watchDirectories: string[];

    constructor(directories: string[], options: { development: boolean; build: boolean; only: 'behavior' | 'resource' | undefined }) {
        super(directories, options);

        this.watchDirectories = this.directories.map((directory) => path.join(env.srcDir, directory));
    }

    public override async execute() {
        console.log('Watching...', this.watchDirectories);
        chokidar.watch(this.watchDirectories).on('change', async (path) => {
            console.log('🟢 change', path);
            await super.execute();
        });

        process.on('SIGINT', () => {
            console.log('Goodbye!');
            process.exit(0);
        });
    }
}

export default WatchCommand;
