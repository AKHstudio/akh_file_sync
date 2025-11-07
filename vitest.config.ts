import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        // テストのタイムアウト設定
        testTimeout: 0, // 各テストケースのタイムアウト無効化
        hookTimeout: 0, // フックのタイムアウト無効化

        // テストファイルのパターン
        include: ['test/**/*.test.ts'],

        // カバレッジ設定
        coverage: {
            include: ['src/**/*.ts'],
            reportsDirectory: 'coverage',
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },

        // 並列実行の設定
        poolOptions: {
            threads: {
                singleThread: false,
            },
        },

        // グローバル変数の使用を許可
        globals: true,

        // 環境設定
        environment: 'node',
    },
});
