import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['plugin:astro/recommended'],
    overrides: [
      {
        files: ['*.astro'],
        parser: 'astro-eslint-parser',
        parserOptions: {
          parser: '@typescript-eslint/parser',
          extraFileExtensions: ['.astro'],
        },
        rules: {
          // override/add rules settings here
        },
      },
    ],
  }),
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.d.ts']
  }
]

export default eslintConfig 