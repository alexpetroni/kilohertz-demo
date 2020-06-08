const { Category } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')

const category = async function (id) {
  let agg = [aggExpr.matchById(id), aggExpr.addId()]
  return (await Category.aggregate(agg))[0]
}

const categories = async function (args = {}) {
  const {
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    sortBy='order',
    sortDesc,
    rawPrice,
  } = args
  let sortOrder = sortDesc ? -1 : 1
  //let agg = [aggExpr.matchByIdArr(idArr), aggExpr.addId()]
  return await Category.find({}).sort([[sortBy, sortOrder]])
}

const searchCategories = async function (args = {}) {
  const {limit} = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), aggExpr.addId()]
  return await Category.aggregate(agg)
}

const paginatedCategories = async function (args = {}) {
  // defaults
  const {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    orderBy = 'order',
    order='ASC',
  } = args

  let agg = [getMatchExpr(args)]


  const itemsQ = Category.aggregate([...agg, aggExpr.sort(orderBy, order), ...aggExpr.pagination(page, itemsPerPage), aggExpr.addId()])
  const totalQ = Category.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])

  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const createCategory = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)
  // check unicity for provided fields
//   await utils.checkUniqueFieldValue(Category, 'name', input.name)
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  input.slug = await utils.generateUniqueSlug(Category, 'slug', slugSeed)
  if(!input.parent) {
    delete input.parent
  }
  const result = await Category.create(input)
  return await category(result._id)
}

const updateCategory = async function (id, input) {
  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'slug'], input, false)

  input = utils.slugifyObjProperties(input, 'slug')
  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(Category, e, input[e], id)))
  }

  await Category.findByIdAndUpdate(id, input)
  return await category(id)
}

// update only order for now
const updateCategories = async function (inputArr) {
  let promArr = inputArr.map(e => {
    return Category.findByIdAndUpdate(e.id, {order: e.order})
  })
  await Promise.all(promArr)
  return await categories
}

const deleteCategory = async function (id) {
  let category = await Category.findById(id)
  await Category.findByIdAndRemove(id)
  return id
}

const deleteCategories = async function (idsArr) {
  let attArr = await Category.find({ _id: {$in: idsArr }})
  await Category.deleteMany({ _id: {$in: idsArr }})
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

function categoryImageAgg () {
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

module.exports = {
  category,
  categories,
  searchCategories,
  paginatedCategories,

  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategories,

  updateCategories,
}
