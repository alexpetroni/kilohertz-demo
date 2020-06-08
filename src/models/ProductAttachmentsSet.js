const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { ProductAttachmentsSet, Product } = require('./../mongo/models')
// const { Product } = require('./Product')

const utils = require('./utils')
const aggExpr = require('./aggregation')



function findProductAttachmentsSetQuery (productId, args = {}) {
  const filter = Object.assign({}, utils.parseQuerySearchTerm(args), ...utils.parseQueryFilters(args), {product: productId})

  const sort = utils.parseQuerySort(args)
  const fields = utils.parseQueryFields(args)

  const q = ProductAttachmentsSet.find(filter)
  if(sort) q.sort(sort)
  if(fields) q.select(fields)

  if(args.limit && args.limit != -1){
    q.limit(args.limit)
  }

  return q
}

const productAttachmentsSet = async function (field, value, name) {
  if(!field || !value) return null
  let productId = await utils.idForKeyValue(field, value, Product)

  if(!productId) return null
  return await ProductAttachmentsSet.findOne({product: productId, name})
}

const productAttachmentsSets = async function (field, value, nameArr) {
  if(!field || !value) return []
  const productId = await utils.idForKeyValue(field, value, Product)
  if(!productId) return []
  let condition = {product: productId}
  if(nameArr) {
    condition.name = {$in: nameArr}
  }
  return await ProductAttachmentsSet.find(condition)
}


const updateProductAttachmentsSet = async function ({product, name, attachments =[]}) {
  if(!product || !name) {
    throw new Error('Required field should not be empty')
  }

  let result = await ProductAttachmentsSet.findOneAndUpdate({product: ObjectId(product), name}, {product, name, attachments}, { upsert: true, new: true })
  let rr = await productAttachmentsSet("id", product, name)

  return await productAttachmentsSet("id", product, name)
}

async function deleteProductAttachmentsSet (id) {
  const del = await ProductAttachmentsSet.findByIdAndDelete(id)
  return id
}

const deleteProductAttachmentsSets = async function (idArr) {
  const del = await ProductAttachmentsSet.deleteMany({ _id: {$in: idArr }})
  return idArr
}

async function deleteAllAttachmentsSetsForProduct (productId) {
  const del = await ProductAttachmentsSet.deleteMany({ product: productId })
  return productId
}


const model = {
  productAttachmentsSet,
  productAttachmentsSets,
  updateProductAttachmentsSet,
  deleteProductAttachmentsSet,
  deleteProductAttachmentsSets,
  deleteAllAttachmentsSetsForProduct,
}

module.exports = model
