require('dotenv').config()

const path = require('path')
const publicDir = path.join(path.resolve(__dirname), './../public')

const config = {
  publicDir,
  port: process.env.PORT || 8080,
  homeUrl: process.env.HOME_URL,
  mongodbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
}

module.exports = config
