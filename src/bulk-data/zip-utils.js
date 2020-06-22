const JSZip = require('jszip')
const fse = require('fs-extra')
const path = require('path')

function zipFileContent (fileName, content = '', extension = 'txt') {
  if(!fileName) throw new Error('No filename provided')

  const fileNameWithExt = fileName + '.' + extension
  const zippedFileName = fileName + '.zip'

  const zip = new JSZip()

  zip.file(fileNameWithExt, content)
  return zip.generateAsync({type: 'nodebuffer', compression:'DEFLATE'})
}

function zipContentTo (content, fileName, destDir = '.', fileExt = '.txt') {
  const zip = new JSZip()
  const zippedFileName = fileName + '.zip'
  const pathDest = path.join(destDir, zippedFileName)

  return new Promise((resolve, reject) => {
    zip.file(fileName + fileExt, content)
    .generateNodeStream({type:'nodebuffer', streamFiles:true})
    .pipe(fse.createWriteStream(pathDest))
    .on('finish', () => resolve(zippedFileName))
  })

}

module.exports = {
  zipFileContent,
  zipContentTo,
}
