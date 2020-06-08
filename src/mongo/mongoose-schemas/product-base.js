const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const productBaseSchema = {
  name: {
    type: String,
    index: true,
  },

  sku: {
    type: String,
    unique: true,
    index: true,
  },

  published: {
    type: Boolean,
    default: false,
    index: true,
  },

  excerpt: {
    type: String,
  },

  description: {
    type: String,
  },

  technicalInformation: {
    type: String,
  },

  price: {
    type: Number,
    default: null,
  },

  salePrice: {
    type: Number,
    default: null,
  },

  volumePrice: {
    type: String,
    default: null,
  },

  saleVolumePrice: {
    type: String,
    default: null,
  },

  saleStartDate: {
    type: Date,
    default: null,
  },

  saleEndDate: {
    type: Date,
    default: null,
  },

  saleType: {
    type: String,
    default: 'ACTION'
  },

  inStock: {
    type: Boolean
  },

  stock: {
    type: Number,
  },

  image: String,

  weightNet: Number,
  weightGross: Number,
  weightUnit: {
    type: String,
    default: 'kg'
  },

  sizeWidth: Number,
  sizeHeight: Number,
  sizeLength: Number,
  sizeUnit: {
    type: String,
    default: 'cm'
  },

  packageWidth: Number,
  packageHeight: Number,
  packageLength: Number,
  packageSizeUnit: {
    type: String,
    default: 'cm'
  },

  packageWeight: Number,
  packageWeightUnit:{
    type: String,
    default: 'kg'
  },

  packaging: String,
}

module.exports = productBaseSchema
