const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { guaranteeArr, isEmptyArray } = require('./../utils')

// defaults & max values
const defaultResultsForSearch = parseInt(process.env.DEFAULT_SEARCH_RESULTS) || 10
const maxSearchResults = parseInt(process.env.MAX_SEARCH_RESULTS) || 30

const defaultResultsPerPage = parseInt(process.env.DEFAULT_RESULTS_PER_PAGE) || 24
const maxResultsPerPage = parseInt(process.env.MAX_RESULTS_PER_PAGE) || 96


function matchById (id) {
  return {"$match": { _id: ObjectId(id)}}
}

function matchByIdArr (idArr) {
  return {"$match": { _id: {"$in": idArr.map(e => ObjectId(e))}}}
}

function matchBySku (sku) {
  return {'$match': {'sku': sku}}
}

// single value match identity
function matchByField (field, value) {
  const matchExpr = field == 'id' ? { _id: ObjectId(value)} : {[field]: value}
  return {"$match": matchExpr}
}

function addId () {
  return {"$addFields": {id: "$_id"}}
}

// parse the arguments provided and return the match object expresion (WITHOUT "$match") for comparation operators
// for given fileds in fieldsArr check if are specifiec conditions in args corresponding to provided operation
// ex: fieldsArr: ['sku'], args: {'sku__in': ['B1'], 'name': 'alfa', 'category': 'flags'} , operator: 'in' will return a match expression object {'sku': {'$in':['B1']}}
// default (undefined or empty) operator is for identity. Other values: ne | in | not_in
function parseMatchCompFilters (fieldsArr, args = {}, operator) {
  const postifx = !operator ? "" : '__'+ operator
  return fieldsArr.reduce((acc, e) => {
    if(args[e + postifx] !== undefined){ // ex. sku__not_in = ..
      Object.assign(acc, computeMatchComparationObject(e, args[e + postifx], operator))
    }
    return acc
  }, {})
}

// return the aggregation expression for multiple operators ex. {name: 'alfa', sku:{'$ne': 'R45'}, category: {'$in': ['flags']} }
function parseMatchCompFiltersMultiOperators (fieldsArr, args, operators = []){
  return operators.reduce((acc, e) => {
    return Object.assign(acc, parseMatchCompFilters(fieldsArr, args, e))
  }, {})
}

// parse the arguments provided and return the match object expresion (WITHOUT "$match") for REGEX comparation
// return a match object with regex conditions ex: {name: {'$regex': 'fla', '$options'}} OR
// if multiple paths are provided an object like {'$or': [{name: {'$regex': 'fla', '$options'}}, {sku: {'$regex': 'fla', '$options'}}]}
// searchPaths - Array | String with values separated by ','
function parseMatchRegexFilters (search, searchPaths = 'name', searchOptions = 'i') {
  const paths = guaranteeArr(searchPaths)
  if(!search || !paths.length) return {}
  let resultArr = paths.reduce((acc, e) => {
    acc.push({[e]: { '$regex': search, '$options': searchOptions }})
    return acc
  }, [])

  return resultArr.length == 1 ? resultArr[0] : {'$or': resultArr}
}

// type field String | Array
// type order String | Array
function sort (field, sortDesc) {
  // default
  if(!field || isEmptyArray(field)) {
    return { "$sort": { 'createdAt' : -1 } }
  }

  if(!Array.isArray(field)) {
    field = [field]
  }
  if(!Array.isArray(sortDesc)) {
    sortDesc = [sortDesc]
  }

  let sortObj = field.reduce((acc, e, index) => {
      acc[e] = sortDesc[index] ? -1 : 1
      return acc
    }, {})
  return { "$sort": sortObj }
}

function limit (n = 10) {
  n = parseInt(n)
  if(isNaN(n) || n < 1 || n > maxSearchResults){
    n = defaultResultsForSearch
  }

  return {"$limit": n}
}

function pagination (page = 1, itemsPerPage) {
  page = parseInt(page)
  itemsPerPage = parseInt(itemsPerPage)
  if(isNaN(page) || page < 1) page = 1
  if(isNaN(itemsPerPage) || itemsPerPage < 1 || itemsPerPage > maxResultsPerPage) itemsPerPage = defaultResultsPerPage
  let skip = (page - 1) * itemsPerPage
// console.log("defaultResultsPerPage", defaultResultsPerPage)
// console.log("defaultResultsPerPage", typeof defaultResultsPerPage)
  return [{"$skip": skip}, {"$limit": itemsPerPage}]
}

// return an object with array values as properties with value 0
// ex. ['tags', 'categories'] => { tags: 0, categories: 0, ..}
function projectExcludeFields (arr = []) {
  const exclude = arr.reduce((acc, val) => {
    acc[val] = 0
    return acc
  }, {})

  return { "$project" : exclude }
}



// -----------------------------------------------------------
// ------------------ PRIVATE ---------------
// -----------------------------------------------------------

// return a match comparation object ex: {_id: {'$in':[..]}} OR  {slug: {'$ne': 'miau'}}
function computeMatchComparationObject (field, value, operator) {
  const path = field == "id" ? "_id" : field
  const isArrayComparation = ["in", "not_in", "like"].indexOf(operator) != -1
  let parsedVal = isArrayComparation ? guaranteeArr(value) : value

  if(path == '_id'){
    parsedVal = isArrayComparation ? parsedVal.map(e => ObjectId(e)) : ObjectId(parsedVal)
  }
  // if it is an identity query
  if(!operator) return { [path]: parsedVal }
  operator = parseOperator(operator)

  return {[path]: {[`$${operator}`]: parsedVal}}
}

// parse some of operators to match MongoDB aggregation operators syntax
function parseOperator (val) {
  if(val == 'not_in'){
    return 'nin'
  }

  return val
}





module.exports = {
  matchById,
  matchByIdArr,
  matchByField,
  matchBySku,
  addId,
  parseMatchCompFilters,
  parseMatchCompFiltersMultiOperators,
  parseMatchRegexFilters,
  sort,
  limit,
  pagination,
  projectExcludeFields,
}
