const fse = require('fs-extra')
const JSZip = require('jszip')

async function zipContentToFile (content, fileName, destination = '.', extension = 'txt') {
  if(!fileName) throw new Error('No filename provided')

  await fse.ensureDir(destination)

  let zip = new JSZip()
  let path = destination +'/' + fileName + '.zip'

  return new Promise((resolve, reject) => {
    zip.file(fileName + '.' + extension, content)
  .generateNodeStream({type:'nodebuffer', streamFiles:true})
  .pipe(fse.createWriteStream(path))
  .on('finish', function () {
      resolve(path)
    })
  })
}

module.exports = {
  zipContentToFile,
}
