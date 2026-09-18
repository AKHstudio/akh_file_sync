import prompts from 'prompts';
import { validateProjectName } from '../helper/index.js';

export interface ProjectOptions {
    projectName: string;
    addonName: string;
    description: string;
    useTypeScript: boolean;
    useLint: boolean;
    usePrettier: boolean;
    initGit: boolean;
}

/**
 * Prompt user for project configuration
 */
export async function promptProjectOptions(defaultProjectName: string = 'akhsync-project'): Promise<ProjectOptions | null> {
    const response = await prompts(
        [
            {
                type: 'text',
                name: 'projectName',
                message: 'Project name:',
                initial: defaultProjectName,
                validate: (value: string) => {
                    if (!value) return 'Project name is required';
                    if (!validateProjectName(value)) {
                        return 'Project name must contain only lowercase letters, numbers, hyphens, and underscores';
                    }
                    return true;
                },
            },
            {
                type: 'text',
                name: 'addonName',
                message: 'Addon name:',
                initial: (prev: string) =>
                    prev
                        .split('-')
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
            },
            {
                type: 'text',
                name: 'description',
                message: 'Description:',
                initial: 'A Minecraft Bedrock Edition addon',
            },
            {
                type: 'confirm',
                name: 'useTypeScript',
                message: 'Use TypeScript?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'useLint',
                message: 'Use ESLint?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'usePrettier',
                message: 'Use Prettier?',
                initial: true,
            },
            {
                type: 'confirm',
                name: 'initGit',
                message: 'Initialize a git repository?',
                initial: true,
            },
        ],
        {
            onCancel: () => {
                console.log('\nOperation cancelled.');
                process.exit(0);
            },
        },
    );

    if (!response.projectName) {
        return null;
    }

    return response as ProjectOptions;
}

/**
 * Display project summary
 */
export function displaySummary(options: ProjectOptions): void {
    console.log('\n📦 Creating new Akhsync project...\n');
    console.log(`  Project name:    ${options.projectName}`);
    console.log(`  Addon name:      ${options.addonName}`);
    console.log(`  Description:     ${options.description}`);
    console.log(`  TypeScript:      ${options.useTypeScript ? '✓' : '✗'}`);
    console.log(`  ESLint:          ${options.useLint ? '✓' : '✗'}`);
    console.log(`  Prettier:        ${options.usePrettier ? '✓' : '✗'}`);
    console.log(`  Git:             ${options.initGit ? '✓' : '✗'}`);
    console.log('');
}

/**
 * Display success message
 */
export function displaySuccess(projectName: string, packageManager: string): void {
    console.log('\n✨ Project created successfully!\n');
    console.log('Next steps:\n');
    console.log(`  cd ${projectName}`);
    console.log(`  ${packageManager} install`);
    console.log(`  ${packageManager} run build\n`);
    console.log('Happy coding! 🚀\n');
}
