const { VariableFeature } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')
const slug = require('slug')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const variableFeatureSet = async function (id) {
  let agg = [aggExpr.matchById(id), aggExpr.addId(), addItemsIds()]
  let c = (await VariableFeature.aggregate(agg))[0]
  return (await VariableFeature.aggregate(agg))[0]
}

const variableFeatureSetBySlug = async function (slug) {
  let agg = [{'$match': {'slug': slug}}, aggExpr.addId(), addItemsIds()]
  return (await VariableFeature.aggregate(agg))[0]
}

const variableFeatureSets = async function (idArr) {
  let agg = [aggExpr.matchByIdArr(idArr), aggExpr.addId(), addItemsIds()]
  return await VariableFeature.aggregate(agg)
}

const variableFeatureSetsBySlug = async function (slugArr) {
  let agg = [{'$match': {'slug': {'$in': slugArr}}}, aggExpr.addId(), addItemsIds()]
  return await VariableFeature.aggregate(agg)
}

const searchVariableFeatureSets = async function (args = {}, loadItems) {
  const {limit} = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), aggExpr.addId(), addItemsIds()]
  return await VariableFeature.aggregate(agg)
}

const paginatedVariableFeatureSets = async function (args = {}) {
  // defaults
  const {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    orderBy, order,
  } = args

  let agg = [getMatchExpr(args)]

  const itemsQ = VariableFeature.aggregate([...agg, aggExpr.sort(orderBy, order), ...aggExpr.pagination(page, itemsPerPage), aggExpr.addId(), addItemsIds()])
  const totalQ = VariableFeature.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])

  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const variableFeatureSetsList = async function () {
   return VariableFeature.find({})
}

const createVariableFeatureSet = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)
  // check unicity for provided fields
  await utils.checkUniqueFieldValue(VariableFeature, 'name', input.name)
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  const uniquePartial = utils.findOnePartial(VariableFeature, {})
  input.slug = await utils.uniqueSlugByIncrement(slugSeed, (val) => uniquePartial('slug', val))

  const result = await VariableFeature.create(input)
  return await variableFeatureSet(result._id)
}

const updateVariableFeatureSet = async function (id, input) {
  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'slug'], input, false)
  input = utils.slugifyObjProperties(input, 'slug')
  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(VariableFeature, e, input[e], id)))
  }
  if(input.items) {
    input.items.forEach(e => {
      if(!e.slug || !e.slug.trim()){
        e.slug = slug(e.name, {lower: true})
      }
    })
  }
  await VariableFeature.findByIdAndUpdate(id, input)
  return await variableFeatureSet(id)
}

const deleteVariableFeatureSet = async function (id) {
  let variableFeatureSet = await VariableFeature.findById(id)
  await VariableFeature.findByIdAndRemove(id)
  return id
}

const deleteVariableFeatureSets = async function (idsArr) {
  let attArr = await VariableFeature.find({ _id: {$in: idsArr }})
  await VariableFeature.deleteMany({ _id: {$in: idsArr }})
  return idsArr
}

const createVariableFeatureSetItem = async function (parentId, input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)

  let parent = await VariableFeature.findById(parentId)
  if(!parent) { throw new Error(`No VariableFeature found for id ${parentId}`)}

  // check unicity for provided fields
  let exists = parent.items ? parent.items.find(e => e.name == input.name) : false
  if(exists){
    throw new Error(`In ${parent.name} already exists an item with name ${input.name}`)
  }

  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  const uniquePartial = utils.findOnePartial(VariableFeature, {_id: ObjectId(parentId)})
  input.slug = await utils.uniqueSlugByIncrement(slugSeed, (val) => uniquePartial('items.slug', val))

  const result = await VariableFeature.findByIdAndUpdate(parentId, {$push: {items: input}}, {new: true})

  if(!result || !result.items) return null
  let newItem = result.items[result.items.length - 1]
  return await variableFeatureSetItem(newItem._id)
}


const updateVariableFeatureSetItem = async function (parentId, id, input) {
  // check index fields if provided not empty
  utils.checkNonEmptyProperties(['name', 'slug'], input, false)

  // check parent exists
  let parent = await VariableFeature.findOne({_id: parentId, "items._id": id})
  if(!parent) { throw new Error(`No VariableFeature item (id:${id}) found for parent (id:${parentId})`)}

  // check unicity for provided fields
  let exists = parent.items ? parent.items.find(e => e.name == input.name && e._id != id) : false
  if(exists){
    throw new Error(`In ${parent.name} already exists an item with name ${input.name}`)
  }

  // ensure unique slug
  if(input.slug){
    const uniquePartial = utils.findOnePartial(VariableFeature, {_id: ObjectId(parentId)}, false)
    input.slug = await utils.uniqueSlugByIncrement(input.slug, (val) => {
      let cond = {"$elemMatch": {_id: {"$ne": id}, slug: val }}
      return uniquePartial("items", cond)
    })
  }

  const updateFields = {}
  Object.keys(input).map(e => {
    if(e != 'id'){
      updateFields['items.$.' + e] = input[e]
    }
  })

  const result = await VariableFeature.findOneAndUpdate({_id: ObjectId(parentId), "items._id": ObjectId(id)}, { $set: updateFields }, {new: true})

  return await variableFeatureSetItem(id)
}

const deleteVariableFeatureSetItem = async function (parentId, id) {
  await VariableFeature.findByIdAndUpdate(parentId, {"$pull": {"items": {_id: ObjectId(id)}}})
  return id
}

const deleteVariableFeatureSetItems = async function (parentId, idArr) {
  await VariableFeature.findByIdAndUpdate(parentId, {"$pull": {"items": {_id: {"$in": utils.idArrToObjectIdArr(idArr)}}}})
  return idArr
}

// -----------------------------------------------------------
// ------------------ PRIVATE ---------------
// -----------------------------------------------------------

function getMatchExpr (args) {
  const matchingFields = ['id', 'name', 'slug',]
  let exprObject = aggExpr.parseMatchCompFiltersMultiOperators(matchingFields, args, ['', 'ne', 'in', 'not_in'])
  if(args.search){
    const {search, searchPaths = ['name', 'slug'], searchOptions} = args
    Object.assign(exprObject, aggExpr.parseMatchRegexFilters(search, searchPaths, searchOptions))
  }
  return {"$match": exprObject}
}

function addItemsIds () {
  return {"$addFields": { items: { "$map": {
    input: "$items",
    as: "item",
    in: {id: "$$item._id", name: "$$item.name", slug: "$$item.slug", description: "$$item.description", value: "$$item.value"}
  }}}}
}


module.exports = {
  variableFeatureSet,
  variableFeatureSetBySlug,
  variableFeatureSets,
  variableFeatureSetsBySlug,

  paginatedVariableFeatureSets,
  variableFeatureSetsList,

  createVariableFeatureSet,
  updateVariableFeatureSet,
  deleteVariableFeatureSet,
  deleteVariableFeatureSets,
}
