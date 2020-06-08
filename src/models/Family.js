const { Family } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')

const family = async function (id) {
  let agg = [aggExpr.matchById(id), ... glueAgg()]
  return (await Family.aggregate(agg))[0]
}

const familyBySlug = async function (slug) {
  let agg = [{'$match': {'slug': slug}}, ... glueAgg()]
  return (await Family.aggregate(agg))[0]
}

const families = async function (idArr) {
  let agg = [aggExpr.matchByIdArr(idArr), ... glueAgg()]
  return await Family.aggregate(agg)
}

const familiesBySlug = async function (slugArr) {
  let agg = [{'$match': {'slug': {'$in': slugArr}}}, ... glueAgg()]
  return await Family.aggregate(agg)
}

const searchFamilies = async function (args = {}) {
  const {limit} = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), ... glueAgg()]
  return await Family.aggregate(agg)
}

const paginatedFamilies = async function (args = {}) {
  // defaults
  const {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    orderBy, order,
  } = args

  let agg = [getMatchExpr(args)]

  const itemsQ = Family.aggregate([...agg, aggExpr.sort(orderBy, order), ...aggExpr.pagination(page, itemsPerPage), ... glueAgg()])
  const totalQ = Family.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])

  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const createFamily = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)
  // check unicity for provided fields
  await utils.checkUniqueFieldValue(Family, 'name', input.name)
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  input.slug = await utils.generateUniqueSlug(Family, 'slug', slugSeed)

  const result = await Family.create(input)
  return await family(result._id)
}

const updateFamily = async function (id, input) {
  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'slug'], input, false)
  input = utils.slugifyObjProperties(input, 'slug')
  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(Family, e, input[e], id)))
  }
  await Family.findByIdAndUpdate(id, input)
  return await family(id)
}

const deleteFamily = async function (id) {
  let family = await Family.findById(id)
  await Family.findByIdAndRemove(id)
  return id
}

const deleteFamilies = async function (idsArr) {
  let attArr = await Family.find({ _id: {$in: idsArr }})
  await Family.deleteMany({ _id: {$in: idsArr }})
  return idsArr
}

// -----------------------------------------------------------
// ------------------ PRIVATE ---------------
// -----------------------------------------------------------

function glueAgg () {
  return [aggExpr.addId(), ... familyProductsAgg(), ...familyLogoAgg()]
}

function getMatchExpr (args) {
  const matchingFields = ['id', 'name', 'slug',]
  let exprObject = aggExpr.parseMatchCompFiltersMultiOperators(matchingFields, args, ['', 'ne', 'in', 'not_in'])
  if(args.search){
    const {search, searchPaths = ['name', 'slug'], searchOptions} = args
    Object.assign(exprObject, aggExpr.parseMatchRegexFilters(search, searchPaths, searchOptions))
  }
  return {"$match": exprObject}
}

function familyLogoAgg () {
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

function familyProductsAgg () {
  return [
    { "$lookup": {
              from: "products",
              let: { productIds: "$products" },
              pipeline: [
                {"$match": { $expr: { $in: ['$_id', "$$productIds"]} }},
                {"$addFields": { id: "$_id"}},
                { "$project": { _id: 0, createdAt: 0, updatedAt:0 }},
              ],
              as: "productsUnordered"
        }},

        // reorder the Products as they are specified in products Array
        {
          "$addFields": {
            "products": {
              $map: {
                input: "$products",
                as: "p",
                in: { $arrayElemAt: [ "$productsUnordered", { "$indexOfArray": [ "$productsUnordered.id", "$$p" ] } ] }
              }
            },
          }
        },
  ]
}

module.exports = {
  family,
  familyBySlug,
  families,
  familiesBySlug,
  searchFamilies,
  paginatedFamilies,

  createFamily,
  updateFamily,
  deleteFamily,
  deleteFamilies,
}
