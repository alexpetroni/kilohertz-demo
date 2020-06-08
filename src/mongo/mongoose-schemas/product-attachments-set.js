const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const schemaDefinition = new Schema({
  product: { type: ObjectId, ref: 'Product' },

  name: {
    type: String
  },

  attachments: [ String ]
},

{timestamps: true})

// schemaDefinition.index({ product: 1, name: 1}, { unique: true })

module.exports = schemaDefinition
