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
    unique: true,
    index: true,
  },

  description: {
    type: String
  },

  order: {
    type: Number,
    default: 5,
  },

  parent: {type: ObjectId, ref: 'Category'},

  ancestors:{
    type: [{type: ObjectId, ref: 'Category'}],
    default: []
  },

  image: { type: String },


}
module.exports = buildTimestampSchema(schemaDefinition)
