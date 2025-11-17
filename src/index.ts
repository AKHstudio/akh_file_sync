import { homedir } from 'os';
import path from 'path';
import fs from 'fs';

import { loadConfig } from '@/config/loader.js';

const config = await loadConfig();

if (config !== null) {
    console.info('⚙️ ', '設定ファイルを読み込みました。\n', config);
}

const syncTargetDir = config?.syncTargetDir ?? path.join(homedir(), 'AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang');
const srcDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');
const distDir = path.join(process.cwd(), 'dist');
const worldDir = path.join(process.cwd(), config?.worldDirName ?? 'world');

if (!fs.existsSync(srcDir)) {
    console.error('❌ ', `srcディレクトリが見つかりません: ${srcDir}`);
    process.exit(1);
}

const akhsyncFlag = 'akhsync';

export { syncTargetDir, srcDir, buildDir, distDir, worldDir, akhsyncFlag };
