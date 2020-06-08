require('./../connection').connect()

const mongoose = require('mongoose')
const schemas = require('./../mongoose-schemas')

// const Attachment = mongoose.model('Attachment', schemas.attachment)
const Brand = mongoose.model('Brand', schemas.brand)
const Category = mongoose.model('Category', schemas.category)
const CategoryMeta = mongoose.model('CategoryMeta', schemas.categoryMeta)
const Family = mongoose.model('Family', schemas.family)
const LinkedProducts = mongoose.model('LinkedProducts', schemas.linkedProducts)
const Product = mongoose.model('Product', schemas.product)
const ProductAttachmentsSet = mongoose.model('ProductAttachmentsSet', schemas.productAttachmentsSet)
const Tag = mongoose.model('Tag', schemas.tag)
const VariableFeature = mongoose.model('VariableFeature', schemas.variableFeature)

module.exports = {
  // Attachment,
  Brand,
  Category,
  CategoryMeta,
  Family,
  LinkedProducts,
  Product,
  ProductAttachmentsSet,
  Tag,
  VariableFeature,
}
