const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const { buildTimestampSchema } = require('./../utils')

const schemaDefinition = {
  name: {
    type: String
  },

  slug: {
    type: String,
    index: true,
    unique: true,
  },

  logo: { type: String },
}

module.exports = buildTimestampSchema(schemaDefinition)
