const imagekit = require('./../image-kit')
const { productsJSON, productExportFileName } = require('./../bulk-data/products')
const { zipFileContent } = require('./../bulk-data/zip-utils')

function wireRoutes (app) {

  app.get(process.env.SERVER_AUTH_PATH_IMGKIT, function(req, res){
    const auth = imagekit.getAuthenticationParameters()
    res.send(auth)
  })


  app.get('/export/products', async (req, res) => {
    const jsonData = await productsJSON()
    const fileName = productExportFileName()
    const zipFile = await zipFileContent(fileName, jsonData)

    res.set('Content-Type', 'application/zip')
    res.set('Content-Disposition', `attachment; filename=${fileName}.zip`)
    res.set('Content-Length', zipFile.length)
    res.end(zipFile, 'binary')
  })


  app.get('/test', function(req, res){
    res.send("Hello test")
  })



  return app
}

module.exports = wireRoutes
