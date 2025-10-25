import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // テストのタイムアウト設定
        testTimeout: 30000,
        hookTimeout: 30000,

        // テストファイルのパターン
        include: ['test/**/*.test.ts'],

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
