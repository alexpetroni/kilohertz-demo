const mongoose = require('mongoose')
const mongodbUri = process.env.DB_URI

const connect = async function () {
  try {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true  })
  mongoose.set('useCreateIndex', true)
    console.log("DB Connection Succeeded")
  } catch (error) {
    console.log("DB Connection Error %o", error)
  }

  // mongoose.connect(mongodbUri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true  })
  // mongoose.set('useCreateIndex', true)
  // const db = mongoose.connection
  // db.on("error", console.error.bind(console, "mongoose connection error"))
  // db.once("open", function(callback){
  //   console.log("DB Connection Succeeded")
  // })
}

module.exports = {
  connect
}
