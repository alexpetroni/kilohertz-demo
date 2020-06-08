const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const { buildTimestampSchema } = require('./../utils')

const linkedProductItem = {
  product: { type: ObjectId, ref: 'Product' },
  variationsSku: [{ type: String }]
}

const LinkedProductItem = new Schema(linkedProductItem, {_id: false})

const schemaDefinition = new Schema({
    product: { type: ObjectId, ref: 'Product' },

    linkType: { type: String },

    links: [{ type: LinkedProductItem }],
  },

  {timestamps: true})

schemaDefinition.index({ product: 1, linkType: 1}, { unique: true })

module.exports = schemaDefinition
