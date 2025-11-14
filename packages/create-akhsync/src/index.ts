#!/usr/bin/env node

import { Command } from 'commander';

import packageJson from '../package.json';

// prettier-ignore
const program = new Command(packageJson.name)
    .version(
        packageJson.version, 
        '-v, --version',
        'output the current version'
    )
    .argument('[project-name]', 'name of the project to create' , "akhsync-project")
    .usage("[project-name] [options]")
    .description('Create a new Akhsync Project.')
    .helpOption('-h, --help', 'output usage information')
    .option('--git', 'initialize a git repository')
    .option("--addon [addon-name]", "create addon samples")
    .option("--config", "set up akhsync configuration file")
    .option("--typescript", "set up TypeScript configuration file")
    .option("--lint", "set up ESLint configuration")
    .option("--prettier", "set up Prettier configuration")
    .action(async (projectName: string , options) => {
        console.log("projectName :", projectName);
        console.log("options :", options);
    });

program.parse(process.argv);
