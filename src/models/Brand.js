const { Brand } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')

const brand = async function (id) {
  let agg = [aggExpr.matchById(id), aggExpr.addId()]
  return (await Brand.aggregate(agg))[0]
}

const brandBySlug = async function (slug) {
  let agg = [{'$match': {'slug': slug}}, aggExpr.addId()]
  return (await Brand.aggregate(agg))[0]
}

const brands = async function (idArr) {
  let agg = [aggExpr.matchByIdArr(idArr), aggExpr.addId()]
  return await Brand.aggregate(agg)
}

const allBrands = async function () {
  let agg = [aggExpr.addId()]
  return await Brand.aggregate(agg)
}

const brandsBySlug = async function (slugArr) {
  let agg = [{'$match': {'slug': {'$in': slugArr}}}, aggExpr.addId()]
  return await Brand.aggregate(agg)
}

const searchBrands = async function (args = {}) {
  const {limit} = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), aggExpr.addId()]
  return await Brand.aggregate(agg)
}

const paginatedBrands = async function (args = {}) {
  // defaults
  const {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    sortBy, sortDesc,
  } = args

  let agg = [getMatchExpr(args)]

  const itemsQ = Brand.aggregate([...agg, aggExpr.sort(sortBy, sortDesc), ...aggExpr.pagination(page, itemsPerPage), aggExpr.addId()])
  const totalQ = Brand.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])

  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const createBrand = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)
  // check unicity for provided fields
  await utils.checkUniqueFieldValue(Brand, 'name', input.name)
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  input.slug = await utils.generateUniqueSlug(Brand, 'slug', slugSeed)

  const result = await Brand.create(input)
  return await brand(result._id)
}

const updateBrand = async function (id, input) {
  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'slug'], input, false)

  input = utils.slugifyObjProperties(input, 'slug')
  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(Brand, e, input[e], id)))
  }

  await Brand.findByIdAndUpdate(id, input)
  return await brand(id)
}

const deleteBrand = async function (id) {
  let brand = await Brand.findById(id)
  await Brand.findByIdAndRemove(id)
  return id
}

const deleteBrands = async function (idsArr) {
  let attArr = await Brand.find({ _id: {$in: idsArr }})
  await Brand.deleteMany({ _id: {$in: idsArr }})
  return idsArr
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

function brandLogoAgg () {
  return [
    { "$lookup": {
              from: "attachments",
              let: { imageId: "$logo" },
              pipeline: [
                {"$match": { $expr: { $eq: ['$_id', "$$imageId"]} }},
                {"$addFields": { id: "$_id"}},
                { "$project": { _id: 0, createdAt: 0, updatedAt:0 }},
              ],
              as: "logo"
        }},

        { "$addFields": {
          "logo": {"$arrayElemAt": ["$logo", 0]}
        }}
  ]
}

module.exports = {
  brand,
  brandBySlug,
  brands,
  allBrands,
  brandsBySlug,
  searchBrands,
  paginatedBrands,

  createBrand,
  updateBrand,
  deleteBrand,
  deleteBrands,
}
