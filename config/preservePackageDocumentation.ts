import fs from 'fs/promises'
import { TSDocConfiguration, TSDocParser } from '@microsoft/tsdoc'

/** @see {@link https://github.com/microsoft/tsdoc/blob/main/api-demo/src/simpleDemo.ts} */

/** */
const entry = await fs.readFile('./src/index.ts', 'utf-8')

const parser = new TSDocParser(new TSDocConfiguration())
const parserContext = parser.parseString(entry)

if (parserContext.docComment.modifierTagSet.hasTagName('@packageDocumentation')) {
  const dts = await fs.readFile('dist/index.d.ts')
  // The `/**/` prefix prevents the @packageDocumentation comment being duplicated after running the API Extractor.
  // There must be an additional line break between @packageDocumentation and the first type declaration,
  // or the first type declaration must have its own TSDoc comment.
  await fs.writeFile('dist/index.d.ts', `${parserContext.docComment.emitAsTsdoc()}\n${dts.toString()}`, 'utf-8')
}
