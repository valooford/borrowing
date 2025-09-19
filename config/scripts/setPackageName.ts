import type packageJson from '../../package.json'

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

type PackageJson = typeof packageJson

async function setPackageName(name: string) {
  try {
    const packageJsonPath = './package.json'
    const data = await readFile(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(data) as PackageJson

    packageJson.name = name

    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
    )
    console.log(`Package name updated to: ${name}`)
  } catch (error) {
    console.error('Error updating package name:', error)
    process.exit(1)
  }
}

let name = process.argv[2]
if (!name) {
  console.error('Usage: node ./setPackageName.ts <name>')
  process.exit(1)
}
name = name.replaceAll(path.sep, '/')
// shouldn't start with: -._~
if (
  !/^(?:(?:@(?:[a-z0-9][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9])[a-z0-9-._~]*$/.test(
    name,
  )
) {
  console.error(
    `String "${name}" does not match the pattern of \
    "^(?:(?:@(?:[a-z0-9][a-z0-9-*._~]*)?/[a-z0-9-._~])|[a-z0-9])[a-z0-9-._~]*$"`,
  )
  process.exit(1)
}

await setPackageName(name)
