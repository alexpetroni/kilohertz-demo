const JSZip = require('jszip')

function zipFileContent (fileName, content = '', extension = 'txt') {
  if(!fileName) throw new Error('No filename provided')

  const fileNameWithExt = fileName + '.' + extension
  const zippedFileName = fileName + '.zip'

  const zip = new JSZip()

  zip.file(fileNameWithExt, content)
  return zip.generateAsync({type: 'nodebuffer', compression:'DEFLATE'})
}

module.exports = {
  zipFileContent,
}
