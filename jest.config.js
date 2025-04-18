/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest', // ✅ ESM用プリセット
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'], // ✅ tsファイルをESMとして扱う
    transform: {
        '^.+\\.ts?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
};
