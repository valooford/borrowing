import type { Options } from 'tsdown'

import { defineConfig } from 'tsdown'

export default defineConfig((options) => {
  const dts: Options['dts'] = {
    //? do not use cache when updating .d.ts (https://github.com/sxzz/rolldown-plugin-dts?tab=readme-ov-file#newcontext)
    newContext: options.watch === true,
  }

  const onSuccess = ['pnpm vitest run']
  if (!options.watch) onSuccess.push('api-extractor run --local --verbose')

  return [
    {
      entry: ['src/next.ts'],
      hash: false,
      target: 'esnext',
      dts,
      outDir: 'dist/next',
      outputOptions: {
        entryFileNames: (info) => `${info.name.replace('next', 'index')}.js`,
      },
    },
    {
      entry: ['src/index.ts'],
      hash: false,
      target: 'esnext',
      dts,
      onSuccess: onSuccess.join(' && '),
    },
  ]
})
