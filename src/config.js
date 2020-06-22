require('dotenv').config()

const path = require('path')
const publicDirPath = path.join(path.resolve(__dirname), './../public')

let homeUrl = process.env.HOME_URL
if(process.env.PORT != 8080){
  homeUrl += ':' + process.env.PORT
}

const config = {
  publicDirPath,
  port: process.env.PORT || 8080,
  homeUrl: homeUrl,
  mongodbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
}

console.log('config %o', config)

module.exports = config
