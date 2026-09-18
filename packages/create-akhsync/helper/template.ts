import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Replace placeholders in file content
 */
export function replacePlaceholders(content: string, replacements: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
}

/**
 * Copy template directory with placeholder replacement
 */
export async function copyTemplate(templateDir: string, targetDir: string, replacements: Record<string, string>): Promise<void> {
    await fs.ensureDir(targetDir);

    const files = await fs.readdir(templateDir);

    for (const file of files) {
        const sourcePath = path.join(templateDir, file);
        const stat = await fs.stat(sourcePath);

        // Replace placeholders in file/directory names
        const targetFileName = replacePlaceholders(file, replacements);
        const targetPath = path.join(targetDir, targetFileName);

        if (stat.isDirectory()) {
            await copyTemplate(sourcePath, targetPath, replacements);
        } else {
            const content = await fs.readFile(sourcePath, 'utf-8');
            const processedContent = replacePlaceholders(content, replacements);
            await fs.writeFile(targetPath, processedContent, 'utf-8');
        }
    }
}

/**
 * Check if directory is empty
 */
export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
    try {
        const files = await fs.readdir(dirPath);
        return files.length === 0;
    } catch {
        return true; // Directory doesn't exist, consider it empty
    }
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): boolean {
    return /^[a-z0-9-_]+$/.test(name);
}

/**
 * Convert project name to addon name (kebab-case to Title Case)
 */
export function projectNameToAddonName(projectName: string): string {
    return projectName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
