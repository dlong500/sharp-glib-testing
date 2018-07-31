import Promise from 'bluebird'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

Promise.promisifyAll(fs)

import { source_folder, destination_folder } from './constants'
import { readFolderImages } from './data'
import { getLowerCaseFileExtension, ensureFolder, delete_output_content } from './helpers'

export async function downsizeImages() {
  let success = true
  const image_source = source_folder + '/downsize'
  const final_destination = destination_folder + '/downsize'

  await delete_output_content()
  try {
    await ensureFolder(final_destination)
  } catch(error) {
    console.error('Unable to create folder for output: ' + error.message)
    process.exit(1)
  }

  return Promise.try(async () => {
    try {
      console.log('Attempting to downsize any image in the input folder with a width or height greater than 4000 pixels...')
      console.log('The processed images will be saved in: ' + final_destination)
      const files = await readFolderImages(image_source)
      if (files.count > 0) {
        for (let file of files.data) {
          const ext = getLowerCaseFileExtension(file)
          const name = file.slice(0, -(ext.length + 1))
          const destname = name + '-downsized' + '.jpg'

          try {
            const i = sharp(path.join(image_source, file))
            const imeta = await i.metadata()
            let resized = null
            if (imeta.width >= imeta.height && imeta.width > 4000) {
              console.log('contraining width to 4000 pixels')
              resized = await i.resize(4000, null)
            } else if (imeta.height > 4000) {
              console.log('contraining height to 4000 pixels')
              resized = await i.resize(null, 4000)
            } else {
              resized = i
            }

            const destfile = final_destination + '/' + destname
            const iresult = await resized
              .toFile(destfile)
              .then(data => {
                console.log('[success downsizing image]: ' + file + ' => ' + destname)
              })
              .catch(error => {
                console.error('[error downsizing image]: ' + file + ':', error.message)
                success = false
              })
          } catch (error) {
            console.error('[error processing image]: ' + file + ':', error.message)
            success = false
          }
        }
        return success
      } else {
        console.warn('Image processing skipped because no source images exist')
        return false
      }
    } catch(error) {
      console.error('Error occurred while attempting to process images:', error.message)
      return false
    }
  })
}

export async function generateDeepZoomData() {
  let success = true
  const image_source = source_folder + '/deepzoom'
  const final_destination = destination_folder + '/deepzoom'

  await delete_output_content()
  try {
    await ensureFolder(final_destination)
  } catch(error) {
    console.error('Unable to create folder for output: ' + error.message)
    process.exit(1)
  }

  return Promise.try(async () => {
    try {
      console.log('Attempting to generate deepzoom data for images in the input folder...')
      console.log('The resultant data will be saved in: ' + final_destination)
      const files = await readFolderImages(image_source)
      if (files.count > 0) {
        await Promise.all(files.data.map(async (file) => {
          const ext = getLowerCaseFileExtension(file)
          const name = file.slice(0, -(ext.length + 1))
          const destname = name + '-zoom' + '.dz'

          try {
            const i = sharp(path.join(image_source, file))
            const destfile = final_destination + '/' + destname
            const iresult = await i
              .tile({
                size: 512,
                layout: 'dz',
              })
              .toFile(destfile)
              .then(data => {
                console.log('[success generating deepzoom data]: ' + file + ' => ' + destname)
              })
              .catch(error => {
                console.error('[error generating deepzoom data]: ' + file + ':', error.message)
                success = false
              })
          } catch (error) {
            console.error('[error processing image]: ' + file + ':', error.message)
            success = false
          }
        }))
        return success
      } else {
        console.warn('Image processing skipped because no source images exist')
        return false
      }
    } catch(error) {
      console.error('Error occurred while attempting to process images:', error.message)
      return false
    }
  })
}
