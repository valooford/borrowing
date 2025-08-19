import { defineConfig } from 'tsup'

export default defineConfig(() => [
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    clean: true,
    format: ['esm'],
    splitting: false,
    treeshake: true,
    dts: true,
    esbuildOptions(options) {
      options.assetNames = '[name]'
    },
    onSuccess: 'pnpm vitest run',
  },
])
