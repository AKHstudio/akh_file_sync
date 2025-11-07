export interface AKHsyncConfig {
    /**
     * 同期対象ディレクトリのパス
     * @default "{userHome}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang"
     */
    syncTargetDir?: string;
    /**
     * ワールドディレクトリ名
     * @default "world"
     */
    worldDirName?: string;
}
