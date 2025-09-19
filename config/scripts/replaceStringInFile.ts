import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

async function replaceStringInFile(filePath: string, from: string, to: string) {
  try {
    const content = await readFile(filePath, 'utf8')
    await writeFile(filePath, content.replaceAll(from, to))
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`)
    process.exit(1)
  }
}

const [filePath, from, to] = process.argv.slice(2)

if (!filePath || !from || !to) {
  console.error('Usage: node ./replaceStringInFile.ts <file-path> <from> <to>')
  process.exit(1)
}

await replaceStringInFile(filePath, from.replaceAll(path.sep, '/'), to.replaceAll(path.sep, '/'))
