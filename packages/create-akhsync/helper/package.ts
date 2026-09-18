import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Initialize git repository
 */
export async function initGit(projectPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        const git = spawn('git', ['init'], {
            cwd: projectPath,
            stdio: 'ignore',
        });

        git.on('close', (code) => {
            resolve(code === 0);
        });

        git.on('error', () => {
            resolve(false);
        });
    });
}

/**
 * Install npm dependencies
 */
export async function installDependencies(projectPath: string, packageManager: 'npm' | 'yarn' | 'pnpm' = 'npm'): Promise<boolean> {
    return new Promise((resolve) => {
        const install = spawn(packageManager, ['install'], {
            cwd: projectPath,
            stdio: 'inherit',
        });

        install.on('close', (code) => {
            resolve(code === 0);
        });

        install.on('error', () => {
            resolve(false);
        });
    });
}

/**
 * Detect package manager
 */
export function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent) {
        if (userAgent.includes('yarn')) return 'yarn';
        if (userAgent.includes('pnpm')) return 'pnpm';
    }

    return 'npm';
}

/**
 * Update package.json with additional dependencies
 */
export async function updatePackageJson(
    projectPath: string,
    updates: {
        lint?: boolean;
        prettier?: boolean;
        typescript?: boolean;
    },
): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
    }

    if (updates.typescript) {
        packageJson.devDependencies['typescript'] = '^5.7.0';
    }

    if (updates.lint) {
        packageJson.devDependencies['eslint'] = '^9.26.0';
        packageJson.devDependencies['@eslint/js'] = '^9.21.0';

        if (updates.typescript) {
            packageJson.devDependencies['typescript-eslint'] = '^8.25.0';
        }

        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
        packageJson.scripts['lint'] = 'eslint src/';
        packageJson.scripts['lint:fix'] = 'eslint src/ --fix';
    }

    if (updates.prettier) {
        packageJson.devDependencies['prettier'] = '^3.5.0';

        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
        packageJson.scripts['format'] = 'prettier --check src/';
        packageJson.scripts['format:fix'] = 'prettier --write src/';
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });
}
