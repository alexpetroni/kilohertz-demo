const imagekit = require('./../image-kit')

const attachment = async function (id, args = {}) {
  return await imagekit.getFileDetails(id)
}

const attachments = async function (idArr, args = {}) {
    let agg = [aggExpr.matchByIdArr(idArr), aggExpr.addId()]
    return await Attachment.aggregate(agg)
}

const searchAttachments = async function (args = {}) {
    const {limit} = args
    let agg = [getMatchExpr(args), aggExpr.limit(limit), aggExpr.addId()]
    return await Attachment.aggregate(agg)
}

// const paginatedAttachments = async function (args = {}) {
//   // defaults
//   const {
//     page,
//     itemsPerPage,
//     search,
//     searchFields = 'filename',
//     searchOptions = 'i',
//     orderBy,
//     order,
//     nextCursor,
//   } = args
//
//
//   let searchExpr = parseSearchTerm(search)
// //console.log('searchExpr %o', searchExpr)
//     let result = await cloudinary.v2.search
//     .expression(searchExpr)
//     .max_results(itemsPerPage)
//     .next_cursor(nextCursor)
//     .execute()
//
//     return {items: result.resources, nextCursor: result.next_cursor, total: result.total_count }
// }

const paginatedAttachments = async function (args = {}) {
    const {
      page,
      itemsPerPage,
      search,
      searchFields = 'filename',
      searchOptions = 'i',
      orderBy,
      order,
      nextCursor,
    } = args

    let options = {
      skip : 0,
      limit : 1000,
    }

    if(search) {
      options.name = search
    }

    let imgArr = await imagekit.listFiles(options)
    return { total: imgArr.length, items: imgArr}
}

const createAttachment = async function (input) {
    return await Attachment.create(input)
}

const updateAttachment = async function (id, input) {
  return await Attachment.findByIdAndUpdate(id, input, {new: true})
}

const deleteAttachment = async function (id) {
  await imagekit.deleteFile(id)
  return id
}

const deleteAttachments = async function (idArr) {
  let attArr = await imagekit.bulkDeleteFiles(idArr)
  return idArr
}

// -----------------------------------------------------------
// ------------------ PRIVATE ---------------
// -----------------------------------------------------------

function getMatchExpr (args) {
  const matchingFields = ['id']
  let exprObject = aggExpr.parseMatchCompFiltersMultiOperators(matchingFields, args, ['', 'ne', 'in', 'not_in'])
  if(args.search){
    const {search, searchPaths = ['filename'], searchOptions} = args
    Object.assign(exprObject, aggExpr.parseMatchRegexFilters(search, searchPaths, searchOptions))
  }
  return {"$match": exprObject}
}

function parseSearchTerm (search) {
  if(!search) return
  let searchArr = search.split(/[\s_-]+/)
  if(!searchArr.length) return
  let pattern = searchArr.filter(e => !!e).map(e => `${e}*`).join(' AND ')
  let s = `filename:(${pattern})`
   // console.log('parseSearchTerm %s', s)
  return s
}

module.exports = {
  attachment,
  attachments,
  searchAttachments,
  paginatedAttachments,

  createAttachment,
  updateAttachment,
  deleteAttachment,
  deleteAttachments,
}
