import fsLegacy from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

export const readJsonFile = async <T>(relativeFilePath: string): Promise<T> => {
  const __dirname = path.resolve()
  const filePath = path.resolve(__dirname, relativeFilePath)
  const jsonStr = await fsp.readFile(filePath, { encoding: 'utf8' })
  return JSON.parse(jsonStr)
}

export const replaceFileContent = async (
  absoluteFilePath: string,
  newContent: string,
): Promise<void> => {
  const tmpDir = await fsp.mkdtemp(
    path.resolve(os.tmpdir(), 'worklog-backend-'),
  )

  process.on('exit', () => {
    // Do best effort to cleanup temp dir and file if some unexpected error occurs
    fsLegacy.rmSync(tmpDir, { force: true, recursive: true })
  })

  await fsp.writeFile(path.resolve(tmpDir, './tmp'), newContent)
  await fsp.copyFile(path.resolve(tmpDir, './tmp'), absoluteFilePath)
  await fsp.rm(tmpDir, { force: true, recursive: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const readAndWriteJson = async <T extends Record<string, any>>(
  relativeFilePath: string,
  callback: (jsonContent: T) => Promise<T> | T,
): Promise<T> => {
  const filePath = path.resolve(path.resolve(), relativeFilePath)
  const jsonContent = await readJsonFile<T>(relativeFilePath)
  const newContent = await callback(jsonContent)
  await replaceFileContent(filePath, JSON.stringify(newContent, null, 2))
  return newContent
}

export const getNewId = async (relativeFilePath: string): Promise<number> => {
  const jsonContent = await readJsonFile(relativeFilePath)
  if (!Array.isArray(jsonContent))
    throw new Error('This function only takes in top-level JSON array')
  return jsonContent.reduce((acc, cur) => Math.max(acc, cur?.id ?? 0), 0) + 1
}
