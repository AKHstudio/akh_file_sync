import { homedir } from 'os';
import path from 'path';

const syncTargetDir = path.join(homedir(), 'AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang');
const srcDir = path.resolve('src');
const buildDir = path.resolve('build');
const distDir = path.resolve('dist');
const worldDir = path.resolve('world');

const akhsyncFlag = 'akhsync';

export { syncTargetDir, srcDir, buildDir, distDir, worldDir, akhsyncFlag };
