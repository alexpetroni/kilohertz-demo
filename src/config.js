require('dotenv').config()

const path = require('path')
const publicDirPath = path.join(path.resolve(__dirname), './../public')


const config = {
  publicDirPath,
  port: process.env.PORT || 8080,
  homeUrl: process.env.HOME_URL,
  mongodbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
}

module.exports = config
