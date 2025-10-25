import { homedir } from 'os';
import path from 'path';
import fs from 'fs';

const syncTargetDir = path.join(homedir(), 'AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang');
const srcDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');
const distDir = path.join(process.cwd(), 'dist');
const worldDir = path.join(process.cwd(), 'world');

if (!fs.existsSync(srcDir)) {
    console.error('❌ ', `srcディレクトリが見つかりません: ${srcDir}`);
    process.exit(1);
}

const akhsyncFlag = 'akhsync';

export { syncTargetDir, srcDir, buildDir, distDir, worldDir, akhsyncFlag };
