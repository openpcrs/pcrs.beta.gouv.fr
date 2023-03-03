import path from 'node:path'
import {writeFile, mkdir} from 'node:fs/promises'
import got from 'got'

export async function downloadTo(resourceUrl, destination, base) {
  const buffer = await got(resourceUrl).buffer()
  const destinationUrl = new URL(destination, base)
  const destinationPath = destinationUrl.pathname
  await mkdir(path.dirname(destinationPath), {recursive: true})
  await writeFile(destinationPath, buffer)
}
