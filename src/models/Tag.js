const { Tag } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')

const tag = async function (id) {
  let agg = [aggExpr.matchById(id), aggExpr.addId(), ...tagLogoAgg()]
  return (await Tag.aggregate(agg))[0]
}

const tagBySlug = async function (slug) {
  let agg = [{'$match': {'slug': slug}}, aggExpr.addId(), ...tagLogoAgg()]
  return (await Tag.aggregate(agg))[0]
}

const tags = async function (idArr) {
  let agg = [aggExpr.matchByIdArr(idArr), aggExpr.addId(), ...tagLogoAgg()]
  return await Tag.aggregate(agg)
}

const tagsBySlug = async function (slugArr) {
  let agg = [{'$match': {'slug': {'$in': slugArr}}}, aggExpr.addId(), ...tagLogoAgg()]
  return await Tag.aggregate(agg)
}

const searchTags = async function (args = {}) {
  const {limit} = args
  let agg = [getMatchExpr(args), aggExpr.limit(limit), aggExpr.addId(), ...tagLogoAgg()]
  return await Tag.aggregate(agg)
}

const paginatedTags = async function (args = {}) {
  // defaults
  const {
    page, itemsPerPage,
    search, searchFields = ['name', 'slug'], searchOptions = 'i',
    orderBy, order,
  } = args

  let agg = [getMatchExpr(args)]

  const itemsQ = Tag.aggregate([...agg, aggExpr.sort(orderBy, order), ...aggExpr.pagination(page, itemsPerPage), aggExpr.addId(), ...tagLogoAgg()])
  const totalQ = Tag.aggregate([...agg, {"$count": "total"}])

  const [items, total] = await Promise.all([itemsQ, totalQ])

  return {
    items,
    total: utils.parsePagTotalAggResult(total)
  }

}

const createTag = async function (input) {
  // check required fields
  utils.checkNonEmptyProperties(['name'], input)
  // check unicity for provided fields
  await utils.checkUniqueFieldValue(Tag, 'name', input.name)
  // ensure unique slug
  let slugSeed = input.slug ? input.slug : input.name
  input.slug = await utils.generateUniqueSlug(Tag, 'slug', slugSeed)

  const result = await Tag.create(input)
  return await tag(result._id)
}

const updateTag = async function (id, input) {
  // check for non-empty & unique field values if provided
  const uniqueFieldsProvided = utils.checkNonEmptyProperties(['name', 'slug'], input, false)
  input = utils.slugifyObjProperties(input, 'slug')
  if(uniqueFieldsProvided.length){
    await Promise.all(uniqueFieldsProvided.map(e => utils.checkUniqueFieldValue(Tag, e, input[e], id)))
  }

  await Tag.findByIdAndUpdate(id, input)
  return await tag(id)
}

const deleteTag = async function (id) {
  let tag = await Tag.findById(id)
  await Tag.findByIdAndRemove(id)
  return id
}

const deleteTags = async function (idsArr) {
  let attArr = await Tag.find({ _id: {$in: idsArr }})
  await Tag.deleteMany({ _id: {$in: idsArr }})
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

function tagLogoAgg () {
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
  tag,
  tagBySlug,
  tags,
  tagsBySlug,
  searchTags,
  paginatedTags,

  createTag,
  updateTag,
  deleteTag,
  deleteTags,
}
