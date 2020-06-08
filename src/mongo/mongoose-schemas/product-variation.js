const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const productBase = require('./product-base')

const { buildTimestampSchema } = require('./../utils')

const schemaDefinition = Object.assign({}, productBase, {
  published: {
    type: Boolean,
    default: true,
    index: true,
  },

  sku: {
    type: String,
    unique: true,
    sparse:true,
    index: true,
  },

  featuresConfig:{
    type: Map,
    of: String,
    index: true,
  }
})

const productVariationSchema = buildTimestampSchema(schemaDefinition)

module.exports = productVariationSchema
