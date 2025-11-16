export interface AKHsyncConfig {
    /**
     * 同期対象ディレクトリのパス
     * @default "{userHome}/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
     */
    syncTargetDir?: string;
    /**
     * ワールドディレクトリ名
     * @default "world"
     */
    worldDirName?: string;
}
