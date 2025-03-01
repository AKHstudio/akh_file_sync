#!/usr/bin/env node

import { Command, Option } from 'commander';
import packageJson from '../../package.json';
import BuildCommand from '@/commands/build.js';
import SyncCommand from '@/commands/sync.js';
import AsyncCommand from '@/commands/async.js';
import WatchCommand from '@/commands/watch.js';

const program = new Command();

// prettier-ignore
program.name('akhsync')
    .version(
        packageJson.version, 
        '-v, --version',
        'output the current version'
    )
    .usage("<command> [options]")
    .description('A simple CLI tool to sync files between two directories')
    .helpOption('-h, --help', 'output usage information');

// build command
// prettier-ignore
program.command("build")
    .usage("[directory...] [options]")
    .description("Build the project")
    .argument("[directory...]", "The directory to build")
    .helpOption("-h, --help", "output usage build command information")
    .option("-d,--development", "Build the project in development mode" , false)
    .addOption(new Option("-o, --only <type>", "build only addon type").choices(["behavior" , "resource"]))
    .action(async (directories : string[] , options) => {
        // console.log(directories , options);
        
        // console.log("Building...");

        const build = new BuildCommand(directories , options);
        await build.execute();
    });

// sync command
// prettier-ignore
program.command("sync")
    .usage("[directory...] [options]")
    .description("Sync files between two directories")
    .argument("[directory...]", "The directory to sync")
    .helpOption("-h, --help", "output usage sync command information")
    .option("-d,--development", "Sync the project in development mode" , false)
    .option("--no-build", "Do not build the project before syncing")
    .addOption(new Option("-o, --only <type>", "sync only addon type").choices(["behavior" , "resource"]))
    .action(async (directories : string[] , options ) => {
        // console.log(directories, options);
        const sync = new SyncCommand(directories , options);
        await sync.execute();
    });

// async command
// prettier-ignore
program.command("async")
    .usage("[directory...]")
    .description("Async files between two directories")
    .argument("[directory...]", "The directory to async")
    .helpOption("-h, --help", "output usage async command information")
    .addOption(new Option("-o, --only <type>", "async only addon type").choices(["behavior" , "resource"]))
    .action(async (directories : string[] , option) => {
        console.log(directories , option);

        const Async = new AsyncCommand(directories , option);
        await Async.execute();
    });

// watch command
// prettier-ignore
program.command("watch")
    .usage("[directory...] [options]")
    .description("Watch files between two directories")
    .argument("[directory...]", "The directory to watch")
    .helpOption("-h, --help", "output usage watch command information")
    .option("-d,--development", "Watch the project in development mode" , false)
    .addOption(new Option("-o, --only <type>", "watch only addon type").choices(["behavior" , "resource"]))
    .action(async (directories : string[] , options) => {
        console.log(directories , options);

        const watch = new WatchCommand(directories , { development: options.development , build: true, only: options.only });
        await watch.execute();
    });

program.parse();
