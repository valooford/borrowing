//* reload VS Code on config changes

// TODO: Support TS config files (https://github.com/prettier/prettier-vscode/issues/3623)

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  semi: false,
  singleQuote: true,
  printWidth: 120,

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  // https://github.com/IanVS/prettier-plugin-sort-imports
  importOrder: [
    '<TYPES>',
    '',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    //? layers: the upper ones must import only the lower ones
    '^@asserts',
    '^@ownership',
    '^@shared',
    '',
    '^[.]',
  ],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],

  overrides: [
    {
      files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
}
