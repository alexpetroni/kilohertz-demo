const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { LinkedProducts, Product } = require('./../mongo/models')

const { product } = require('./Product')

const { idForKeyValue } = require('./utils')


const linkedProducts = async function (field, value, linkType, allVariations) {
  let productId = await idForKeyValue(field, value, Product)
  if(!productId) return null
  let lp = await LinkedProducts.findOne({product: ObjectId(productId), linkType})
  if(!lp) return null
  let products = await Promise.all(lp.links.map(e => product(e.product)))

  let results = { id: lp.id, links: []}
  // replace id's with product and remove empty products
  lp.links.map((e, index) => {
    if(products[index]){
      results.links.push({product: products[index], variationsSku: e.variationsSku})
    }
  })


  if(!allVariations){
    // console.log('before filter variations results.links %o', results.links)
    results.links = results.links.map(e => stripLinkedProductToVariations(e))
    results.links = results.links.map(e => stripLinkedProductToVariableFeatures(e))
    //   {
    //   if(e.product.type == 'VARIABLE' && e.variationsSku && e.variationsSku.length){
    //     e.product.variations = e.product.variations.filter(v => {
    //       return e.variationsSku.indexOf(v.sku) != -1
    //     })
    //   }
    //   return e
    // })
  }
  // console.log('after filter variations results.links %o', results.links)
  return results
}

const updateLinkedProducts = async function (productId, linkType, inputArr) {
  let updateResult = await LinkedProducts.findOneAndUpdate({product: ObjectId(productId), linkType}, {$set: {product: productId, linkType, links: inputArr}}, { upsert:true, new: true })
  let result = await linkedProducts('id', productId, linkType, true)
  return result
}

const deleteLinkedProducts = async function (productSku, linkType, skuArr) {
  return []
}

const deleteAllLinkedProducts = async function (productSku) {
  return '23'
}

// for a VariableProduct keep only the variations that are specified in 'variationsSku' array
function stripLinkedProductToVariations (linkedProduct) {
  if(!isVariableProduct(linkedProduct.product) || !hasRestrictedVariationsSkus(linkedProduct)) return linkedProduct

  let {product, variationsSku} = linkedProduct
  if(product.variations && Array.isArray(product.variations)){
    linkedProduct.product.variations = product.variations.filter(e => variationsSku.indexOf(e.sku) >= 0 )
  }

  return linkedProduct
}

// for a VariableProduct keep only the variable features that are used by selected variations
function stripLinkedProductToVariableFeatures (linkedProduct) {
  if(!isVariableProduct(linkedProduct.product) || !hasRestrictedVariationsSkus(linkedProduct)) return linkedProduct
  let { product } = linkedProduct
  let variationsVF = variationsVariableFeatures(product)
  if(product.variableFeatures){
    product.variableFeatures = product.variableFeatures.map(e => {
      let fiArr = variationsVF[e.slug]
      if(fiArr){
        e.items = e.items.filter(fi => fiArr.indexOf(fi.slug) >= 0)
      }
      return e
    })
  }
//  console.log('variationsVF %o', variationsVF)
  return linkedProduct
}

function isVariableProduct (product) {
  return product && product.type === 'VARIABLE'
}

function hasRestrictedVariationsSkus (linkedProduct) {
  return linkedProduct && linkedProduct.variationsSku && Array.isArray(linkedProduct.variationsSku) && linkedProduct.variationsSku.length
}

// map over a VariableProduct variations and return all the variable features used in form of an object {vfSlug: [vfItemSlug], ...}
function variationsVariableFeatures (product) {
  if(!(isVariableProduct(product) && product.variations && Array.isArray(product.variations))) return {}
  return product.variations.reduce((acc, e) => {
    Object.keys(e.featuresConfig).map(k => {
      if(!acc[k]) acc[k] = []
      if(acc[k].indexOf(e[k]) == -1) {
        acc[k].push(e[k])
      }
    })
    return acc
  }, {} )
}


module.exports = {
  linkedProducts,

  updateLinkedProducts,
  deleteLinkedProducts,
  deleteAllLinkedProducts,
}
