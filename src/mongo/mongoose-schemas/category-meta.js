const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const { buildTimestampSchema } = require('./../utils')

const schemaDefinition = {
    category: {
      type: ObjectId,
      ref: 'Category',
      unique: true
    },

    title: String,

    description: String,

    previewFields: {
      type: [{
        title: String,
        content: String,
        image: String,
      }],

      default: [
        { title: '', content: ''},
        { title: '', content: ''},
        { title: '', content: ''}
      ]
    },

    highlights: {
      type: [{
        title: String,
        content: String,
      }],

      default: []
    }
}


module.exports = buildTimestampSchema(schemaDefinition)
