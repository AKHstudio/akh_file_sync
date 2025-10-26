import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // テストのタイムアウト設定
        testTimeout: 0, // 各テストケースのタイムアウト無効化
        hookTimeout: 0, // フックのタイムアウト無効化

        // テストファイルのパターン
        include: ['test/**/*.test.ts'],

        // ファイル単位で順次実行（テスト内は並列可）
        fileParallelism: false,

        // 並列実行の設定
        poolOptions: {
            threads: {
                singleThread: false,
            },
        },

        // 環境設定
        environment: 'node',
    },
});
