import js from '@eslint/js'
import { Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import { configs, parser } from 'typescript-eslint'

const tseslint = { parser, configs }

type Config = ReturnType<typeof defineConfig>[number]

export default defineConfig([
  globalIgnores(['dist/*'], 'Ignore irrelevant files'),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended', importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    languageOptions: { globals: globals.browser },
    settings: {
      //? fix `Unable to resolve path to module` - missing file extensions in paths
      'import/resolver': {
        typescript: true,
      },
    },
  },
  //? fix (https://typescript-eslint.io/getting-started/typed-linting/)
  // <<<
  //     Error: Error while loading rule '@typescript-eslint/await-thenable':
  //     You have used a rule which requires type information, but don't have
  //     parserOptions set to generate type information for this file.
  //                                                                          >>>
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // https://typescript-eslint.io/users/configs
    extends: [tseslint.configs.strictTypeChecked as Config, tseslint.configs.stylisticTypeChecked as Config],
    rules: {
      'import/no-cycle': 2,

      //? namespaces are used to add utility types to classes
      '@typescript-eslint/no-namespace': 0,

      //? actively used
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,

      //? allow _underscored ones (https://typescript-eslint.io/rules/no-unused-vars/#what-benefits-does-this-rule-have-over-typescript)
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
])
