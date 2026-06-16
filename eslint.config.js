import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist', 'node_modules', 'coverage'],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'no-undef': 'off',
            'no-unused-vars': 'off',
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    {
        files: [
            'src/context/**/*.{ts,tsx}',
            'src/data/**/*.{ts,tsx}',
            'src/components/layout/CategorySidebar.tsx',
        ],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
];
