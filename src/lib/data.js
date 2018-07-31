import Promise from 'bluebird'
import fs from 'fs'

Promise.promisifyAll(fs)

export async function readFolderImages(folder) {
  const payload = { status: 0, count: 0, message: '' }
  const dir = await fs.readdirAsync(folder)
  const list = dir.filter(function(file) { return file.substr(file.length - 4).toLowerCase() === ('.jpg') }).sort()
  return { ...payload, status: 1, data: list, count: list.length }
}

