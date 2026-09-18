#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

import { promptProjectOptions, displaySummary, displaySuccess } from './prompts.js';
import { generateUUIDs, copyTemplate, isDirectoryEmpty, initGit, installDependencies, detectPackageManager, updatePackageJson, projectNameToAddonName } from '../helper/index.js';

interface CLIOptions {
    git?: boolean;
    typescript?: boolean;
    lint?: boolean;
    prettier?: boolean;
    yes?: boolean;
}

async function createProject(projectName: string, options: CLIOptions) {
    try {
        const projectPath = path.resolve(process.cwd(), projectName);

        // Check if directory exists and is not empty
        if (await fs.pathExists(projectPath)) {
            const isEmpty = await isDirectoryEmpty(projectPath);
            if (!isEmpty) {
                console.error(chalk.red(`\n✗ Directory "${projectName}" already exists and is not empty.\n`));
                process.exit(1);
            }
        }

        let projectOptions;

        // If --yes flag is provided, use defaults
        if (options.yes) {
            projectOptions = {
                projectName,
                addonName: projectNameToAddonName(projectName),
                description: 'A Minecraft Bedrock Edition addon',
                useTypeScript: options.typescript ?? true,
                useLint: options.lint ?? true,
                usePrettier: options.prettier ?? true,
                initGit: options.git ?? true,
            };
        } else {
            // Interactive prompts
            const prompted = await promptProjectOptions(projectName);
            if (!prompted) {
                process.exit(0);
            }
            projectOptions = prompted;
        }

        // Display summary
        displaySummary(projectOptions);

        // Generate UUIDs for manifest files
        const [bpHeaderUuid, bpModuleUuid, bpScriptUuid, rpHeaderUuid, rpModuleUuid] = generateUUIDs(5);

        // Prepare template replacements
        const replacements = {
            PROJECT_NAME: projectOptions.projectName,
            ADDON_NAME: projectOptions.addonName,
            ADDON_DESCRIPTION: projectOptions.description,
            BP_HEADER_UUID: bpHeaderUuid,
            BP_MODULE_UUID: bpModuleUuid,
            BP_SCRIPT_UUID: bpScriptUuid,
            RP_HEADER_UUID: rpHeaderUuid,
            RP_MODULE_UUID: rpModuleUuid,
        };

        // Determine template directory
        const templateType = projectOptions.useTypeScript ? 'typescript' : 'javascript';
        const templateDir = path.join(__dirname, '..', 'templates', templateType);

        console.log(chalk.blue('📝 Copying template files...'));
        await copyTemplate(templateDir, projectPath, replacements);

        // Remove optional config files if not needed
        if (!projectOptions.useLint) {
            const eslintConfigPath = path.join(projectPath, 'eslint.config.js');
            await fs.remove(eslintConfigPath);
        }

        if (!projectOptions.usePrettier) {
            const prettierConfigPath = path.join(projectPath, '.prettierrc');
            await fs.remove(prettierConfigPath);
        }

        // Update package.json with additional dependencies
        await updatePackageJson(projectPath, {
            typescript: projectOptions.useTypeScript,
            lint: projectOptions.useLint,
            prettier: projectOptions.usePrettier,
        });

        // Initialize git repository
        if (projectOptions.initGit) {
            console.log(chalk.blue('📦 Initializing git repository...'));
            const gitSuccess = await initGit(projectPath);
            if (gitSuccess) {
                console.log(chalk.green('✓ Git repository initialized'));
            } else {
                console.log(chalk.yellow('⚠ Failed to initialize git repository'));
            }
        }

        // Detect package manager
        const packageManager = detectPackageManager();

        // Display success message
        displaySuccess(projectOptions.projectName, packageManager);
    } catch (error) {
        console.error(chalk.red('\n✗ Error creating project:'), error);
        process.exit(1);
    }
}

// prettier-ignore
const program = new Command(packageJson.name)
    .version(
        packageJson.version, 
        '-v, --version',
        'output the current version'
    )
    .argument('[project-name]', 'name of the project to create' , "akhsync-project")
    .usage("[project-name] [options]")
    .description('Create a new Akhsync Project for Minecraft Bedrock Edition addon development.')
    .helpOption('-h, --help', 'output usage information')
    .option('--git', 'initialize a git repository')
    .option("--typescript", "use TypeScript (default)")
    .option("--lint", "set up ESLint configuration")
    .option("--prettier", "set up Prettier configuration")
    .option('-y, --yes', 'skip prompts and use default values')
    .action(async (projectName: string , options: CLIOptions) => {
        await createProject(projectName, options);
    });

program.parse(process.argv);
