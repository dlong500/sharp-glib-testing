import sharp from 'sharp'

import { downsizeImages, generateDeepZoomData } from './lib/imaging'
import { command } from './lib/constants'

// Output sharp version info
console.log('sharp.versions:', sharp.versions)

// Run the app
app()

async function app() {
  try {

  // The non-fatal Glib warnings only seem to appear with sharp cache disabled?
  sharp.cache(false)
  // console.log('sharp.cache: ', sharp.cache())
  // console.log('sharp.concurrency: ', sharp.concurrency())

    if (command === 'downsize') {
      await downsizeImages()
    } else if (command === 'deepzoom') {
      await generateDeepZoomData()
    } else {
      console.log('Invalid option: Please specify downsize or deepzoom')
      process.exit(1)
    }
  } catch(error) {
    console.error('Error Occurred during app run: ' + error.message)
    process.exit(1)
  }
}