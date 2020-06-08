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

// // const Currency = require('./currency/typeDef')
const VariableFeature = require('./variable-feature')

// const User = require('./user/typeDef')
// const Order = require('./order/typeDef')
// const Sale = require('./sale/typeDef')
// const Page = require('./page/typeDef')

const Query = `
  type Query {
    _empty: String
  }
  `

const Mutation = `
  type Mutation {
    _empty: String
  }`

const typeDefs = [
  Query,
  Mutation,
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
  // CategoryMeta,
  // // Currency,
  VariableFeature,
  //
  // User,
  // Order,
  // Sale,
  // Page,
]

module.exports = typeDefs
