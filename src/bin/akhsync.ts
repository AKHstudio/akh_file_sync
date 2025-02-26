#!/usr/bin/env node

import { Command, Option } from 'commander';
import packageJson from '../../package.json';
import BuildCommand from '@/commands/build.js';

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
    .action(async (directorys : string[] , options) => {
        // console.log(directorys , options);
        
        // console.log("Building...");

        const build = new BuildCommand(directorys , options);
        build.execute();
    });

program.parse();
