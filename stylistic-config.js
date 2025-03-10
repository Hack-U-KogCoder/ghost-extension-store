import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      // インデントは2スペース
      '@stylistic/indent': ['error', 2],
      // 1行の文字数を80文字に制限
      '@stylistic/max-len': [
        'error',
        {
          code: 80,
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