// @ts-check
import pluginImportX from 'eslint-plugin-import-x'
import pluginPromise from 'eslint-plugin-promise'
import pluginSonarjs from 'eslint-plugin-sonarjs'
// eslint-disable-next-line import-x/extensions
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Sonarjs recommended (ESLint 9 flat config)
  pluginSonarjs.configs.recommended,

  // Promise recommended (flat config)
  pluginPromise.configs['flat/recommended'],

  // === Глобальные правила (все файлы) ===
  {
    plugins: {
      'import-x': pluginImportX,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // General JS
      'arrow-body-style': 'off',
      'consistent-return': 'off',
      camelcase: 'off',
      'max-len': ['warn', {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      }],
      'no-mixed-operators': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'no-console': ['warn', { allow: ['error'] }],
      'no-shadow': 'off',
      'no-multiple-empty-lines': 'off',
      'arrow-parens': 'off',
      'default-param-last': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-promise-executor-return': 'off',
      'no-async-promise-executor': 'off',
      'no-useless-catch': 'off',
      'prefer-regex-literals': 'off',
      'function-paren-newline': 'off',
      'object-curly-newline': 'off',
      radix: 'off',
      'lines-between-class-members': 'off',
      'class-methods-use-this': 'off',
      'no-use-before-define': 'off',

      // import-x
      'import-x/no-cycle': 'warn',
      'import-x/no-named-as-default': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/extensions': ['error', 'ignorePackages', {
        js: 'never',
        ts: 'never',
      }],
      'import-x/order': ['error', {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'internal', 'object', 'unknown', 'type'],
        'newlines-between': 'never',
      }],

      // promise (overrides from flat/recommended)
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/no-nesting': 'warn',

      // sonarjs (overrides from recommended)
      'sonarjs/no-duplicate-string': 'off',
    },
  },

  // === Правила для Vue-файлов ===
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-v-html': 'off',
      'vue/no-unused-refs': 'error',
      'vue/define-macros-order': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
      }],
      'vue/no-required-prop-with-default': 'error',
    },
  },

  // === Правила TypeScript (.ts и .vue — там, где есть TS-парсер) ===
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: false }],
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-this-alias': ['error', {
        allowDestructuring: true,
        allowedNames: ['self'],
      }],
    },
  },

  // === JS/CJS файлы — разрешаем require() ===
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
)
