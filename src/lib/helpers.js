import fs from 'fs'
import fse from 'fs-extra'
import del from 'del'

import { destination_folder, command } from './constants'

export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function getLowerCaseFileExtension(filename) {
  return getFileExtension(filename).toLowerCase()
}

export async function ensureFolder(path) {
  try {
    // just wrap fs-extra ensureDir (works recursively, unlike fs.mkdir)
    await fse.ensureDir(path)
    return true
  } catch (error) {
    throw error
  }
}

export async function folderExists(path) {
  try {
    // can't currently use fs.access(path, fs.constants.R_OK) because nodejs doesn't check ACLs on Windows (at least as of v10.7)
    // instead we use fs.stat to actually read the folder and handle errors
    await fs.statAsync(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EPERM') {
      return false
    } else {
      throw error
    }
  }
}

export async function delete_output_content() {
  try {
    if (await folderExists(destination_folder)) {
      // Change working directory to destination folder for safety with deletions
      process.chdir(destination_folder)

      const deletions = []
      deletions.push(destination_folder + '/' + command + '/' + '*')

      const deletecontent = await del(deletions, {force: false, dryRun: false})
      console.log('-> Removed existing output content (if present) in preparation for image processing')
    }
    return true
  } catch (error) {
    console.error('Problem checking for or removing existing output content:' + error.message)
    console.error('Aborting app')
    process.exit(1)
  }
}