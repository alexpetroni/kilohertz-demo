const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const { buildTimestampSchema } = require('./../utils')

const productBase = require('./product-base')

const ProductVariation = require('./product-variation')

const schemaDefinition = Object.assign({}, productBase, {
  slug: {
    type: String,
    unique: true,
    index: true,
  },

  type: {
    type: String,
    enum: ['SIMPLE', 'VARIABLE'],
    index: true,
  },

  displayOrder: {
    type: Number,
    default: 10,
  },

  vat: {
    type: Number,
    default: null,
  },

  categories: [{type: ObjectId, ref: 'Category'}],

  tags: [{type: ObjectId, ref: 'Tag'}],

  brand: {type: ObjectId, ref: 'Brand'},


  // --- start --- for VARIABLE product only
  variableFeatures: {
    type: [ {
      //   _id: false,
        slug: String, // VariableFeature slug
        items: [{type: String}] // subselection of slugs from the referenced VariableFeature
      } ],
    index: true,
  },

  variations: {
    type: [ProductVariation]
  },

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
  }

})

module.exports = buildTimestampSchema(schemaDefinition)
