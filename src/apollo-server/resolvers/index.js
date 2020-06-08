const merge = require('deepmerge')

const Common = require('./common')

const Attachment = require('./attachment')
const Brand = require('./brand')
const Category = require('./category')
const CategoryMeta = require('./category-meta')
const Family = require('./family')
const LinkedProducts = require('./linked-products')
const Product = require('./product')
const ProductAttachmentsSet = require('./product-attachments-set')
const Tag = require('./tag')
const VariableFeature = require('./variable-feature')

const resolvers = merge.all([
  Common,

  Attachment,
  Brand,
  Category,
  CategoryMeta,
  Family,
  LinkedProducts,
  Product,
  ProductAttachmentsSet,
  Tag,
  VariableFeature,
])

module.exports = resolvers
