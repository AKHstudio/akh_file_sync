import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { ignores: ['docs/**/*'] },
    { languageOptions: { globals: globals.node } },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn'],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
