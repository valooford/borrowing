import type { Options } from 'tsdown'

import { defineConfig } from 'tsdown'

const nodeTs = (scriptAndArgs: string) =>
  `node --experimental-strip-types ${scriptAndArgs}`

export default defineConfig((options) => {
  const dts: Options['dts'] = {
    //? do not use cache when updating .d.ts (https://github.com/sxzz/rolldown-plugin-dts?tab=readme-ov-file#newcontext)
    newContext: options.watch === true,
  }

  const onSuccess = ['pnpm test']
  if (!options.watch)
    onSuccess.push(
      nodeTs('./config/scripts/preservePackageDocumentation.ts'),
      'api-extractor run --local --verbose',
      /* +next */
      nodeTs(
        './config/scripts/preservePackageDocumentation.ts next.ts next/index.d.ts',
      ),
      nodeTs('./config/scripts/setPackageName.ts "@temp/borrowing"'),
      'api-extractor run --local --verbose -c config/api-extractor.next.json',
      nodeTs(
        './config/scripts/replaceStringInFile.ts ./temp/borrowing.next.api.json @temp/borrowing borrowing/next',
      ),
      /* cleanup */
      nodeTs('./config/scripts/setPackageName.ts "borrowing"'),
    )

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
