const { homeUrl, publicDirPath } = require('./../config')
const path = require('path')
const fse = require('fs-extra')
const imagekit = require('./../image-kit')
const { productsJSON, productExportFileName } = require('./../bulk-data/products')
const { zipContentTo } = require('./../bulk-data/zip-utils')






function wireRoutes (app) {

  app.get(process.env.SERVER_AUTH_PATH_IMGKIT, function(req, res){
    const auth = imagekit.getAuthenticationParameters()
    res.send(auth)
  })


  app.get('/export/products', async (req, res) => {
    const fileName = productExportFileName()
    const outputDir = 'export/products'
    const destination = path.join(publicDirPath, outputDir )

    const jsonData = await productsJSON()

    // clean previous exports and recreate a clean one
    await fse.remove(destination)
    await fse.ensureDir(destination)

    const zipedFileName = await zipContentTo(jsonData, fileName, destination)

    const url = homeUrl + '/' + outputDir + '/' + zipedFileName

    res.send(url)
  })


  app.get('/test', function(req, res){
    res.send("Hello test")
  })



  return app
}

module.exports = wireRoutes
