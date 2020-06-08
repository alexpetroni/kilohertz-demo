const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

function buildTimestampSchema (obj) {
  return new Schema (obj, {timestamps: true})
}


module.exports = {
  buildTimestampSchema,
}
