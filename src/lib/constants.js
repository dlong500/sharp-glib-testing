if (process.argv.length < 3) {
  console.log('Missing option: Please specify downsize or deepzoom')
  process.exit(1)
}

export const command = process.argv[2]

export const data_folder = __basedir + '/testdata'
export const source_folder = data_folder + '/input'
export const destination_folder = data_folder + '/output'

