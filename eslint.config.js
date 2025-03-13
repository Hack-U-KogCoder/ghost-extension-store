import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));


import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';


const StylisticConfig = ts.config(
  {
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      // インデントは2スペース
      '@stylistic/indent': ['error', 2],
      // 1行の文字数を100文字に制限
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          ignoreUrls: true,
        },
      ],
      // ダブルクォートを強制
      '@stylistic/quotes': ['error', 'double'],
      // セミコロンを必ずつける
      '@stylistic/semi': ['error', 'always'],

      // 演算子の前後にスペースを強制
      '@stylistic/space-infix-ops': 'error',
      // TypeScript特有のフォーマット設定も追加
      "@stylistic/ts/space-infix-ops": "error",
    },
  },
);


export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
	  globals: {
	    ...globals.browser,
	    ...globals.node
	  },
	}
  },
  {
    extends: [...StylisticConfig],
    files: ["**/*.js","**/*.ts","**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    ignores: ["eslint.config.js", "svelte.config.js", "drizzle.config.ts"],

    languageOptions: {
	  parserOptions: {
	    projectService: true,
	    extraFileExtensions: ['.svelte'],
	    parser: ts.parser,
	    svelteConfig
	  }
	}
  }
);