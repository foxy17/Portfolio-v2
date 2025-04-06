import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  js.configs.recommended,
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
]

export default eslintConfig 