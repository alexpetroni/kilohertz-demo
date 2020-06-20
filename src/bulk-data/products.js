const path = require('path')
const fse = require('fs-extra')
const moment = require('moment')
const JSZip = require('jszip')

const { productsExport } = require('./../models/Product')

const  { homeUrl, publicDirPath, tmpExportDirectory } = require('./../config')



function exportProductsFileName () {
  return 'products-export-' + moment().format('YYYY-MM-DD')
}

async function productsJSON () {
  let prodArr = await productsExport()
  let prodText = JSON.stringify(prodArr, null, 4)
  return prodText
}

const exportProducts = async function () {
  try {
    await fse.remove(path.join(publicDirPath, tmpExportDirectory)) // clean product export directory

    const fileName = exportProductsFileName()
    
    const content = await productsJSON()

    const zippedFileName = await zipContentToFile(content, fileName, path.join(publicDirPath, tmpExportDirectory))

    const fileRelPath = path.join(tmpExportDirectory, zippedFileName)
    return homeUrl + '/' + fileRelPath
  }catch (error) {
    throw error
  }

}

async function zipContentToFile (content, fileName, dir = '.', extension = 'txt') {
  if(!fileName) throw new Error('No filename provided')

  await fse.ensureDir(dir)

  const fileNameWithExt = fileName + '.' + extension
  const zippedFileName = fileName + '.zip'

  const zip = new JSZip()
  const fullZipPath = path.join(dir, zippedFileName)



  return new Promise((resolve, reject) => {
    zip.file(fileNameWithExt, content)
  .generateNodeStream({type:'nodebuffer', streamFiles:true})
  .pipe(fse.createWriteStream(fullZipPath))
  .on('finish', function () {
      resolve(zippedFileName)
    })
  })
}

module.exports = {
  exportProducts,
}
