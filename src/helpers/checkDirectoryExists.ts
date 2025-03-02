import { stat } from 'fs/promises';

/**
 *  check directory exists
 * @param dirPath  directory path
 * @returns  true if directory exists, false if not
 */
async function checkDirectoryExists(dirPath: string) {
    try {
        const stats = await stat(dirPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}

export default checkDirectoryExists;
