const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { Product, Family } = require('./../mongo/models')

const { productAttachmentsSet, updateProductAttachmentsSet } = require('./ProductAttachmentsSet')

const { publicDirPath, homeUrl } = require('./../config')

const omit = require('lodash.omit')

const utils = require('./utils')
const aggExpr = require('./aggregation')


const newItemIdPrefix = '__new__'
const isNewItemRegExp = new RegExp(newItemIdPrefix)

function isNewItemId (id) {
  return isNewItemRegExp.test(id)
}

const product = async function (id, raw) {
  let agg = [aggExprProductMatch('id', id)]

  agg.push(... aggExprProductVariationCase('id', id))

  agg.push( ... prodAssamblerAgg(raw))

  let res = (await Product.aggregate(agg))[0]

  let d = new Date()
  let dStr = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()

  return (await Product.aggregate(agg))[0]
}

const productBy = async function (field, value, args = {}) {
  let { rawPrice, excludeVariations, variationAsProduct } = args
  let agg = [aggExprProductMatch(field, value, excludeVariations)]

  if(!excludeVariations){
    agg.push(... aggExprProductVariationCase(field, value, variationAsProduct))
  }

  agg.push( ... prodAssamblerAgg(rawPrice))

  let result = await Product.aggregate(agg)
  return result[0]
}

const productBySku = async function (sku, args = {}) {
  let { rawPrice, excludeVariations, variationAsProduct } = args
  let agg = [aggExprProductMatch('sku', sku, excludeVariations)]

  if(!excludeVariations){
    agg.push(... aggExprProductVariationCase('sku', sku, variationAsProduct))
  }

  agg.push( ... prodAssamblerAgg(rawPrice))

  return (await Product.aggregate(agg))[0]
}

const productBySlug = async function (slug, args = {}) {
  let { rawPrice, excludeVariations, variationAsProduct } = args
  let agg = [aggExprProductMatch('slug', slug, excludeVariations)]

  if(!excludeVariations){
    agg.push(... aggExprProductVariationCase('slug', slug, variationAsProduct))
  }

  agg.push( ... prodAssamblerAgg(rawPrice))

  return (await Product.aggregate(agg))[0]
}

const cartProducts = async function (idArr, args = {}) {
  return await Promise.all(idArr.map(e => product(e, args)))
}

const products = async function (idArr, args = {}) {
  let { rawPrice, excludeVariations } = args
  let agg = [aggExprProductsMatch('id', idArr, excludeVariations),... prodAssamblerAgg(rawPrice)]

  return await Product.aggregate(agg)
}

const productsBy = async function (field, valueArr, args = {}) {
  let { rawPrice , excludeVariations } = args
  let match = field == 'id' ? aggExpr.matchByIdArr(valueArr) : {'$match': {[field]: {'$in': valueArr}}}
  let agg = [aggExprProductsMatch(field, valueArr, excludeVariations),... prodAssamblerAgg(rawPrice)]
  return await Product.aggregate(agg)
}

const productsBySku = async function (skuArr, args = {}) {
  let { rawPrice, excludeVariations } = args
  let agg = [aggExprProductsMatch('sku', skuArr, excludeVariations), ... prodAssamblerAgg(rawPrice)]
  return await Product.aggregate(agg)
}

const productsBySlug = async function (slugArr, args = {}) {
  let { rawPrice, excludeVariations } = args
  let agg = [aggExprProductsMatch('slug', slugArr, excludeVariations), ... prodAssamblerAgg(rawPrice)]
  return await Product.aggregate(agg)
}

const searchProducts = async function (args = {}) {
  const { limit, rawPrice } = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), ... prodAssamblerAgg(rawPrice)]
  return await Product.aggregate(agg)
}

const paginatedProducts = async function (args = {}) {

  // defaults
  let {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug', 'sku'], searchOptions = 'i',
    sortBy,
    sortDesc,
    rawPrice,
  } = args

  let agg = [getMatchExpr(args)]

  if(!sortBy || (Array.isArray(sortBy) && !sortBy.length)){
    sortBy = ['displayOrder']
  }

  const itemsQ = Product.aggregate([...agg, aggExpr.sort(sortBy, sortDesc), ...aggExpr.pagination(page, itemsPerPage), ... prodAssamblerAgg(rawPrice)])
  const totalQ = Product.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])
  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const productTags = async function (field, value) {
  let res = await Product.aggregate([
    aggExpr.matchByField(field, value),
    { "$lookup": {
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags"
    }},
    { "$project": { _id: 0, tags: 1}},
    { "$unwind": "$tags" },
    { "$replaceRoot": { newRoot: "$tags" } },
    { "$project": { id: "$_id", name: "$name", slug: "$slug"}}

  ])
  return res
}

const productCategories = async function (field, value) {
  let res =  await Product.aggregate([
    aggExpr.matchByField(field, value),
    { "$lookup": {
      from: "categories",
      localField: "categories",
      foreignField: "_id",
      as: "categories"
    }},
    { "$project": { _id: 0, categories: 1}},
    { "$unwind": "$categories" },
    { "$project": { id: "$categories._id", "name": "$categories.name", "slug": "$categories.slug"}}

  ])
  return res
}

const productBrand = async function (field, value) {
  const res = await Product.aggregate([
    aggExpr.matchByField(field, value),
    { "$lookup": {
      from: "brands",
      localField: "brand",
      foreignField: "_id",
      as: "brand"
    }},
    { "$unwind": "$brand" },
    { "$replaceRoot": { newRoot: "$brand" } },
    { "$addFields": { id: "$_id"}}
  ])
  return res ? res[0] : null
}


const productGallery = async function (field, value) {
  let productGallery = await productAttachmentsSet(field, value, 'gallery')
  return productGallery && productGallery.attachments ? productGallery.attachments : []
}

const productFamily = async function (field, value) {
  let productId = null
  if(field == 'id'){
    productId = value
  } else{
    let prod = await Product.findOne({[field]: value}, '_id')
    productId = prod && prod._id
  }
  if (!productId) return null
  let family = await Family.findOne({"products": productId})
  .populate({
    path: 'products',
    select: 'id name slug type sku image'
    })
  return family
}

const productVariableFeatures = async function (id) {
  const agg = [
    aggExpr.matchById(id),
    ...aggExprProductVariableFeatures(),
  ]

  const vfs = (await Product.aggregate(agg))[0]

  return vfs ? vfs.variableFeatures : []
}

const productVariation = async function (parentId, id){
  let prod = await Product.findById(parentId)
  if(!prod) {
    throw new Error("No parent product with this id")
  }

  let variation = prod.variations.find(e => e.id == id)

  return variation
}

const productsExport = async function () {
  let idArrObj = await Product.find({}, 'id')
  let idArr = idArrObj.map(e => e._id)

  let prodArr = []
  for (let i = 0; i < idArr.length; i++){
    // let prod = await product(idArr[i])
    let prod = await Product.findById(idArr[i]).populate('brand', 'name').lean()
    let variations = null

    if(prod.type == 'VARIABLE'){
      variations = prod.variations
      delete prod.variations
    }

    prod = cleanProductForExport(prod)

    prodArr.push(prod)

    if(variations && variations.length) {
      variations.map(e => {
        e.parentSku = prod.sku
        e.type = 'VARIATION'
        prodArr.push(cleanProductVariationForExport(e))
      })
    }
  }

  return prodArr
}

function cleanProductForExport (p) {
  if(!p) return
  let product = omit(p, ['categories', 'tags', 'createdAt', 'updatedAt', '_id', '__v'])

  // delete '_id' from sub-arrays
  let subArr = ['previewFields', 'variableFeatures']
  subArr.forEach(item => {
    if(product[item]) {
      product[item] = product[item].map(e => omit(e, '_id'))
    }
  });

  if(product.brand) {
    delete product.brand._id
  }

  return product
}

function cleanProductVariationForExport (v) {
  return omit(v, ['createdAt', 'updatedAt', '_id', '__v'])
}

const createProduct = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name', 'sku', 'type'], input)
  // check unicity for provided fields
  await Promise.all(['name', 'sku'].map(e => utils.checkUniqueFieldValue(Product, e, input[e])))
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  input.slug = await utils.generateUniqueSlug(Product, 'slug', slugSeed)

  const result = await Product.create(input)

  return await product(result.id, { rawPrice: true })
}

const updateProduct = async function (id, input) {
  // product type is immutable after product creation
  delete input.type
  //await Product.findByIdAndUpdate(id, {price: 11})

  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'sku', 'slug'], input, false)
  input = utils.slugifyObjProperties(input, 'slug')

  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(Product, e, input[e], id)))
  }

  let r = await Product.findByIdAndUpdate(id, input)

  let nePro = await Product.findById(id)

  return product(id, true)
}

const deleteProduct = async function (id) {
  let product = await Product.findById(id)
  await Product.findByIdAndRemove(id)
  return id
}

const deleteProducts = async function (idArr) {
  let attArr = await Product.find({ _id: {$in: idArr }})
  await Product.deleteMany({ _id: {$in: idArr }})
  return idArr
}

const updateProductTags = async function (id, idArr) {
  await Product.findByIdAndUpdate(id, { tags: idArr } )
  return await productTags('id', id)
}

const updateProductCategories = async function (id, idArr) {
  await Product.findByIdAndUpdate(id, { categories: idArr } )
  return await productCategories('id', id)
}

const updateProductBrand = async function (id, brandId) {
  let r = await Product.findByIdAndUpdate(id, { brand: brandId }, {new: true} )
  return await productBrand('id', id)
}

const updateProductImage = async function (id, imageId) {
  let result = await Product.findByIdAndUpdate(id, {image: imageId}, {new: true})
  return result.image
}

const updateProductGallery = async function (id, idArr) {
  let result = await updateProductAttachmentsSet({product: id, name:'gallery', attachments: idArr})
  return await productGallery('id', id)
}


const updateProductVariableFeatures = async function (id, inputArr) {

  await Product.findByIdAndUpdate(id, {variableFeatures: inputArr} )
  // delete variations that have other features combinations that parent product specify in 'variableFeatures'
  await removeIncompatibleVariations(id)
  let t = await productVariableFeatures(id)

  return (await productVariableFeatures(id))
}

const addProductVariation = async function (parentId, input) {
  const result = await Product.findByIdAndUpdate(id, { $push: {variations: input}}, {new: true} )
  let variation = result.variations.slice(-1)[0]
  return productVariationsItem(variation._id, true)
}

const updateProductVariation = async function (parentId, id, input) {
  const updateFields = {}
  Object.keys(input).map(e => {
      updateFields['variations.$.' + e] = input[e]
  })

  await Product.findOneAndUpdate({_id: ObjectId(parentId), "variations._id": id}, {"$set": updateFields} )

  await enforceVariationsSync(id)

  return await productVariation(parentId, id)
}

async function enforceVariationsSync (productId) {
  return new Promise((resolve, reject) => {
    resolve("a")
  })
}

// remove existing elements that are not present in itemsArr, update existing one and add new ones (that have an id in form '__new__bla-bla')
async function updateProductVariations (parentId, inputArr) {
  // split existing variations from the existing ones
  let freshVariations = []
  let recordedVariations = []

  inputArr.forEach(item => {
    if(isNewItemId(item.id)){
      delete item.id
      freshVariations.push(item)
    }else{
      recordedVariations.push(item)
    }
  })

  // remove existing elements that are not present in inputArr
  const recordedIds = recordedVariations.map(e => e.id)
  await Product.findByIdAndUpdate(parentId, {$pull: {variations: {_id: { $nin: recordedIds }}}})

  // for already recorded variations
  if(recordedVariations.length){
      // update the already recoreded variations
      const updatePromiseArr = recordedVariations.map(item => {
        let updateFields = {}
        Object.keys(item).map(e => {
          if(e != 'id'){
            updateFields['variations.$.' + e] = item[e]
          }
        })

        return Product.findOneAndUpdate({_id: ObjectId(parentId), "variations._id": ObjectId(item.id) }, {"$set": updateFields}, {upsert: true} )
      })
    await Promise.all(updatePromiseArr)
  }

  if(freshVariations.length){
    let freshPromiseArr = freshVariations.map(item => Product.findOneAndUpdate({_id: ObjectId(parentId)}, {$push: {variations:item}}))
    await Promise.all(freshPromiseArr)
  }

  return await productVariationsItems(parentId, true)
}

async function deleteProductVariation (parentId, id) {
  await Product.findByIdAndUpdate(parentId, { $pull: {"variations": {_id: id}}})
  return id
}

async function deleteProductVariations (parentId, idArr) {
  await Product.findByIdAndUpdate(parentId, { $pull: {"variations": {_id: {"$in": idArr}}}} )
  return idsArr
}
// -----------------------------------------------------------
// ------------------ PRIVATE ---------------
// -----------------------------------------------------------

function prodAssamblerAgg (rawPrice) {
  return [
    aggExpr.addId(),
    ... aggExprSale(rawPrice),
    ... aggExprProductVariableFeatures(),
    ... aggExprProductVariationsItems(rawPrice),
    ... aggExprBrand(),
  ]
}

function aggExprProductMatch (field, value, excludeVariations) {
  let matchFilter = field == 'id' ? {_id: ObjectId(value)} : {[field]: value}

  if(!excludeVariations){
    let variationFilter = field == 'id' ? {"variations._id": ObjectId(value)} : {["variations." +field]: value}
    matchFilter = {$or: [matchFilter, variationFilter]}
  }

  return { "$match": matchFilter }
}

function aggExprProductsMatch (field, valArr, excludeVariations) {
  let cond = field == 'id' ? {"$in": valArr.map(e => ObjectId(e))} : {"$in": valArr}

  let matchFilter = field == 'id' ? {_id: cond} : {[field]: cond}

  if(!excludeVariations){
    let variationFilter = field == 'id' ? {"variations._id": cond} : {["variations." +field]: cond}
    matchFilter = {$or: [matchFilter, variationFilter]}
  }
  return { "$match": matchFilter }
}

function getMatchExpr (args) {
  const matchingFields = ['id', 'name', 'slug', 'sku']
  let exprObject = aggExpr.parseMatchCompFiltersMultiOperators(matchingFields, args, ['', 'ne', 'in', 'not_in'])
  if(args.search){
    const {search, searchPaths = ['name', 'sku', 'slug'], searchOptions = 'i'} = args
    Object.assign(exprObject, aggExpr.parseMatchRegexFilters(search, searchPaths, searchOptions))
  }

  if(args.category){
    exprObject["$expr"] = {"$in":[ObjectId(args.category), "$categories"]}
  }

  return {"$match": exprObject}
}

function productImageAgg () {
  return [
    { "$lookup": {
              from: "attachments",
              let: { imageId: "$image" },
              pipeline: [
                {"$match": { $expr: { $eq: ['$_id', "$$imageId"]} }},
                {"$addFields": { id: "$_id"}},
                { "$project": { _id: 0, createdAt: 0, updatedAt:0 }},
              ],
              as: "image"
        }},

        { "$addFields": {
          "image": {"$arrayElemAt": ["$image", 0]}
        }}
  ]
}

function aggExprBrand () {
  return [
    { "$lookup": {
              from: "brands",
              let: { brandId: "$brand" },
              pipeline: [
                {"$match": { $expr: { $eq: ['$_id', "$$brandId"]} }},
                {"$addFields": { id: "$_id"}},
                { "$project": { _id: 0, createdAt: 0, updatedAt:0 }},
              ],
              as: "brand"
        }},

        { "$addFields": {
          "brand": {"$arrayElemAt": ["$brand", 0]}
        }}
  ]
}

function productGalleryAgg () {
  return [
    { "$lookup": {
        from: "attachments",
        localField: "gallery",
        foreignField: "_id",
        as: "gallery"
      }},
    { "$unwind": "$gallery" },
    { "$replaceRoot": { newRoot: "$gallery" } },
    { "$addFields": { id: "$_id"}}
  ]
}

// remove the variations of the product that have incompatible features with the declared in parent 'variableFeatures'
async function removeIncompatibleVariations (id) {
  const prodVariations = await productVariationsItems(id)
  let prodVariableFeatureArr = await productVariableFeatures(id)

  const prodVariableFeatureObj = prodVariableFeatureArr.reduce((acc, e) => {
    acc[e.slug] = e.items.map(f => f.slug)
    return acc
  }, {})
  const keyNumbers = Object.keys(prodVariableFeatureObj).length

  const prodFeatures = Object.keys(prodVariableFeatureObj)
  const prodVariationsToDelete = prodVariations.filter(e => {
      let fc = e.featuresConfig
      let fcKeys = Object.keys(fc)
      return fcKeys.length != keyNumbers || fcKeys.some(e => !prodVariableFeatureObj[e]) || fcKeys.some(e => prodVariableFeatureObj[e].indexOf(fc[e]) == -1)
    }).map(e => ObjectId(e.id))

  if(prodVariationsToDelete.length){
    await Product.findByIdAndUpdate(id, {$pull: {variations: {_id: {$in: prodVariationsToDelete}}}})
  }

  return prodVariationsToDelete
}

async function productVariationsItems (id, raw) {
  const aggExpr = aggExprVariationItems(id, raw)
  try{
    let res = await Product.aggregate(aggExpr)
    return await Product.aggregate(aggExpr)
  }catch(err){
    throw err
  }
}

// return all variations items of the product [PVItem], NOT a ProductVariation
function aggExprVariationItems (id, raw = false) {
  return [
    aggExpr.matchById(id),
    {"$unwind": "$variations"},
    {"$replaceRoot": { newRoot: "$variations" }},
    aggExpr.addId(),
    // ...aggExprSale(raw),
  ]
}

async function productVariableFeaturesLean (id) {
  const vfs = await Product.findById(id, 'variableFeatures')
  return vfs && vfs.variableFeatures ? vfs.variableFeatures : null
}


// ------------- private aggregation expression product price && sales -------------
// 'raw' means that instead of 'regularPrice', 'regularVolumePrice' are provided the 'salePrice', 'saleVolumePrice', 'saleStartDate', 'saleEndDate'
// 'raw' is used for administrative purposes
function aggExprSale (rawPrice) {
  let exprArr = [ aggExprHasSale() ]
  if(!rawPrice){
    exprArr.push(aggExprSalePrice())
  }
  return exprArr
}

function aggExprHasSale () {
  var currentDate = new Date()
  return  {
    "$addFields": {
        saleIsActive: { "$cond": {
          if: { $and: [
                      { $ne: ["$salePrice", null]},
                      { $or: [{$eq: ["$saleStartDate", null] }, { $lte: ["$saleStartDate", currentDate]}]},
                      { $or: [{$eq: ["$saleEndDate", null] }, { $gte: ["$saleEndDate", currentDate]}, "$stockLiquidation" ]},
                    ]
              },
          then: true,
          else: false
        }
      }
    }
  }
}

function aggExprSalePrice () {
  return  {
    "$addFields": {

      price: { "$cond": {
      if: "$saleIsActive",
      then: "$salePrice",
      else: "$price"
        },
      },

      regularPrice: { "$cond": {
      if: "$saleIsActive",
      then: "$price",
      else: "$$REMOVE"
        },
      },

      volumePrice: { "$cond": {
      if: "$saleIsActive",
      then: "$saleVolumePrice",
      else: "$volumePrice"
        },
      },

      regularVolumePrice: { "$cond": {
      if: "$saleIsActive",
      then: "$volumePrice",
      else: "$$REMOVE"
        },
      },

      saleStartDate: { "$cond": {
      if: "$saleIsActive",
      then: "$saleStartDate",
      else: "$$REMOVE"
        },
      },

      saleEndDate: { "$cond": {
      if: "$saleIsActive",
      then: "$saleEndDate",
      else: "$$REMOVE"
        },
      },
    },
  }
}



// ------------- private aggregation expression product VariableFeatures & Variations -------------
function aggExprProductVariableFeatures__original () {
  return [
    { "$lookup" : {
      "from": "variablefeatures",
      "localField": "variableFeatures.slug",
      "foreignField": "slug",
      "as": "tmpVariableFeatures"
    }},

    {
      "$addFields": {
        "variableFeatures": {
          $cond: {
            if: {$in: ["$type", ["VARIABLE", "VARIATION"]]},
            then: {"$map": {
                        input: "$tmpVariableFeatures",
                        as: "vf",
                        in: {
                          "id": "$$vf._id",
                          "type": "$$vf.type",
                          "name": "$$vf.name",
                          "slug": "$$vf.slug",
                          "description": "$$vf.description",
                          "items": {
                            "$filter": {
                              input: "$$vf.items",
                              as: "q",
                              cond: {
                                "$let": {
                                  vars: {
                                    "selected": { $arrayElemAt: [ "$variableFeatures", { "$indexOfArray": [ "$variableFeatures.slug", "$$vf.slug" ] } ] }
                                  },
                                  in: {$in: ["$$q.slug", "$$selected.items"]}
                                }
                              }
                            }
                          }
                        }
                      }
                    },
            else: "$$REMOVE"
          }

        }
      }
    },
  ]
}


function aggExprProductVariableFeatures () {
  return [
    { "$lookup" : {
      "from": "variablefeatures",
      "localField": "variableFeatures.slug",
      "foreignField": "slug",
      "as": "vfSet"
    }},
    // array lookup in mongo mess the order of elements
    // select the VF with correspondent  elements in "prodVfUnordered"
    {
      "$addFields": {
        "prodVfUnordered": {
          $cond: {
            if: {$in: ["$type", ["VARIABLE", "VARIATION"]]},
            then: {"$map": {
                        input: "$vfSet",
                        as: "vf",
                        in: {
                          "id": "$$vf._id",
                          "type": "$$vf.type",
                          "name": "$$vf.name",
                          "slug": "$$vf.slug",
                          "description": "$$vf.description",
                          "items": {
                            "$filter": {
                              input: "$$vf.items",
                              as: "q",
                              cond: {
                                "$let": {
                                  vars: {
                                    "selected": { $arrayElemAt: [ "$variableFeatures", { "$indexOfArray": [ "$variableFeatures.slug", "$$vf.slug" ] } ] }
                                  },
                                  in: {$in: ["$$q.slug", "$$selected.items"]}
                                }
                              }
                            }
                          }
                        }
                      }
                    },
            else: "$$REMOVE"
          }

        }
      }
    },
    // reorder the VariableFeatures as they are specified in product
    {
      "$addFields": {
        "variableFeatures": {
          $map: {
            input: "$variableFeatures",
            as: "vf",
            in: { $arrayElemAt: [ "$prodVfUnordered", { "$indexOfArray": [ "$prodVfUnordered.slug", "$$vf.slug" ] } ] }
          }
        },
      }
    },

  ]
}


// return aggregation expression for variations items of the product [PVItem], NOT a ProductVariation
function aggExprProductVariationsItems (rawPrice) {
  var currentDate = new Date()
  let agg = [
    // { "$lookup" : {
    //   "from": "attachments",
    //   "localField": "variations.image",
    //   "foreignField": "_id",
    //   "as": "tmpVariationsImages"
    // }},

    {"$addFields": {
      "variations": { $cond: {
        if: {$eq: ["$type", "VARIABLE"]},
        then: {"$map": {
          input: "$variations",
          as: "v",
          in: {$mergeObjects: ["$$v", {
            saleIsActive: { "$cond": {
              if: { $and: [
                          { $ne: ["$$v.salePrice", null]},
                          { $or: [{$eq: ["$$v.saleStartDate", null] }, { $lte: ["$$v.saleStartDate", currentDate]}]},
                          { $or: [{$eq: ["$$v.saleEndDate", null] }, { $gte: ["$$v.saleEndDate", currentDate]}, {$eq: ["$$v.saleType", "STOCK_LIQUIDATION"] } ]},
                        ]
                  },
              then: true,
              else: false
            }
          }
        },
        {id: "$$v._id"}
      ]}
        }},
        else: "$$REMOVE"
        }}
    }},
  ]


  if(!rawPrice){
    agg.push(
      {"$addFields": {
        "variations": { $cond: {
          if: {$eq: ["$type", "VARIABLE"]},
          then: {"$map": {
            input: "$variations",
            as: "v",
            in: {$mergeObjects: ["$$v", {
              price: {
                "$cond": {
                  if: "$$v.saleIsActive",
                  then: "$$v.salePrice",
                  else: "$$v.price"
              }},

              regularPrice: {
                "$cond": {
                  if: "$$v.saleIsActive",
                  then: "$$v.price",
                  else: "$$REMOVE"
              }},

              volumePrice: {
                "$cond": {
                  if: "$$v.saleIsActive",
                  then: "$$v.saleVolumePrice",
                  else: "$$v.volumePrice"
                }},

              regularVolumePrice: {
                "$cond": {
                  if: "$$v.saleIsActive",
                  then: "$$v.volumePrice",
                  else: "$$REMOVE"
              }},

          },
          {id: "$$v._id"}
        ]}
          }},
          else: "$$REMOVE"
          }}
      }})
  }

  return agg
}


// change the 'type' field and add 'parentId' field if it is a ProductVariation
function aggExprProductVariationCase (field, value, raw) {

  let fieldCondition = field == 'id' ? ["$_id", ObjectId(value) ] : ["$"+field, value ]
  let variationCondition = field == 'id' ? [ObjectId(value), "$$variations._id"] : [value, "$$variations."+field]

  let selectVariationConditon = field == 'id' ? [ObjectId(value), "$$variation._id"] : [value, "$$variation."+field]

  let aggExpr = [
    // change 'type' accordingly if it is a ProductVariation
    {"$addFields": {
      "type": { $cond: {
        if: { $and: [
          { $eq: ["$type", "VARIABLE"]},
          { $ne: fieldCondition } // if the provided 'id' or 'sku' does not match on parent level, is a ProductVariation
        ]},
        then: "VARIATION",
        else: "$type" // keep the original 'type'
        }}
      }
    },

    // add 'parentId' if it is a ProductVariation
    {"$addFields": {
      "parentId": { $cond: {
        if: {$eq: ["$type", "VARIATION"]},
        then: "$_id",
        else: "$$REMOVE"
      }},

      "parentSku": { $cond: {
        if: {$eq: ["$type", "VARIATION"]},
        then: "$sku",
        else: "$$REMOVE"
      }},

      "selectedVariation": {
        "$cond": {
          "if": {"$eq": ["$type", "VARIATION"]},
          "then": {"$filter": {
            "input": "$variations",
            "as": "variation",
            "cond": {"$eq": selectVariationConditon}
          }},
          "else": []
        }
      },
      },
    },
  ]

  if(raw){
    aggExpr.push({"$replaceRoot": { "newRoot": {"$mergeObjects": ["$$ROOT", { $arrayElemAt: [ "$selectedVariation", 0 ]}]}}})
  }else{
    aggExpr.push(
      {"$addFields": {
        // remove null values from variation before merge with the parent
        "selectedVariation": {
          "$arrayToObject": {
            "$filter": {
              input: {"$objectToArray": { $arrayElemAt: [ "$selectedVariation", 0 ]}},
              as: "vk",
              cond: {$and: [{"$ne": ["$$vk.v", null]}, {"$ne": ["$$vk.v", []]}]}
            }
          }

        },
      },
    },

    {"$replaceRoot": { "newRoot": {"$mergeObjects": ["$$ROOT", "$selectedVariation"]}}})
  }

  return aggExpr
}


module.exports = {
  product,
  productBy,
  productBySku,
  productBySlug,
  products,
  productsBy,
  productsBySku,
  productsBySlug,
  searchProducts,
  paginatedProducts,

  productTags,
  productCategories,
  productBrand,
  productGallery,

  productVariableFeatures,

  productVariation,

  cartProducts,

  productsExport,

  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,

  updateProductTags,
  updateProductCategories,
  updateProductBrand,
  updateProductImage,
  updateProductGallery,

  productFamily,

  updateProductVariableFeatures,

  addProductVariation,
  updateProductVariation,
  updateProductVariations,
  deleteProductVariation,
  deleteProductVariations,
}
