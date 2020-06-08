const slug = require('slug')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// filter an object properties based on predicate function
function filterObject (obj, predicate) {
  if(!obj.__proto__ || obj.__proto__.constructor.name !== 'Object'){
    throw new Error("The obj provided should be an Object")
  }

  let newObj = {}
  for(let prop in obj){
    if(obj.hasOwnProperty(prop) && predicate(obj[prop], prop, obj)){
      newObj[prop] = obj[prop]
    }
  }

  return newObj
}

// return the item id for the first item that match
// null otherwise
async function idForKeyValue (field, value, model) {
  if(!field || !value || !model) return null
  if(field == 'id') {
    return value
  }
  let p = await model.findOne({[field]:value}, 'id')
  return p ? p.id : null
}

// parse pagination total aggregation result
// total results for an aggregation can be an empty array or an array
// with first element an object with the fieldName called (usually) 'total'
function parsePagTotalAggResult (total, fieldName = 'total') {
  return total[0] ? total[0][fieldName] : 0
}

function idArrToObjectIdArr (idsArr) {
  return idsArr.map(e => ObjectId(e))
}


function guaranteeArr (arg, stringDelim = ',') {
  if(Array.isArray(arg)) return arg

  if(typeof arg === 'string'){
    return arg.split(stringDelim).map(e => e.trim())
  }

  throw new Error("Array or String expected as first argument.")
}

function isEmptyArray (val) {
  return Array.isArray(val) && !val.length
}

// check that the specified properties from 'propArr' are not empty in args if suplied (checks as strings)
// if 'required': true, all properties are mandatory to be present
// return array with non-empty properties names, throw an Error otherwise
function checkNonEmptyProperties (propArr, args, required = true){
  return propArr.filter(e => {
    if(args[e] === undefined){
      if(required){
        throw new Error(`Required ${e} argument not provided`)
      }
      return false
    }
    let val = (args[e] + "").trim()

    if(!val){
      throw new Error(`Argument ${e} must not be empty`)
    }
    return true
  })
}

// check if the specified field: value already exists in provided Mongoose model
// if exceptId provided, exclude it from query
// return Promise which resolve to Boolean
function isFieldValueUnique (model, field, value, exceptId) {
  let trimmed = ("" + value).trim()
  let condition = {[field]: trimmed}
  if(exceptId) {
    condition._id = {"$ne": ObjectId(exceptId)}
  }

  return new Promise((resolve, reject) => resolve(model.findOne(condition)))
  .then((res) => !res)
  .catch(error => {throw new Error(error.message)})
}

// trow an error if the specified field: value already exists in provided Mongoose model
// if exceptId provided, exclude it from query
function checkUniqueFieldValue (model, field, value, exceptId) {
  const condition = exceptId ? {_id :{"$ne": ObjectId(exceptId)}} : {}
  let partial = findOnePartial(model, condition)
  return partial(field, value)
  .then(res => {
    if(res){ //
      throw new Error(`An item with value "${value}" as "${field}" already exists in ${model.collection.name}.`)
    }

    return true
  })
  .catch(error => {throw new Error(error.message)})
}

// return a promise that resolve to a unique value for the provided field starting from the initial value ex: val ? val_1 ? val_n
// if initial value is not provided a random string is generated
function generateUniqueSlug (model, field, value, exceptId, slugify) {
  let condition = exceptId ? { _id: {"$ne": ObjectId(exceptId)}} : {}
  const uniquePartial = findOnePartial(model, condition)
  return uniqueSlugByIncrement(value, (seed) => uniquePartial(field, seed), 0, slugify)
}

// if provided object attributes exist, slugify them
// return object with slugifyied attributes
function slugifyObjProperties (obj, ...attr) {
  let newObj = Object.assign({}, obj)
  attr.map(e => {
    if(newObj[e] !== undefined && typeof newObj[e] === 'string'){
      newObj[e] = slug(newObj[e], {lower: true})
    }
  })
  return newObj
}

// -------------------------------------------------------------------------------------
// ------------------------- THIS TWO --------------------------------------------------
// return a function with provided clousure
// function return a promise that will be resolved to true if no results are found for provided condition
function findOnePartial (model, conditions = {}, trim = true) {
  return (field, value) => {
    if(typeof value === 'string' && trim){
      value = value.trim()
    }
    conditions[field] = value

    return new Promise(resolve => resolve(model.findOne(conditions)))
  }
}

// generate an increment slug_n until 'checkIsUniquePromise' promise return a 'true' on checking
function uniqueSlugByIncrement(seed, checkIfExistsPromise, n = 0, slugify = true){
  if(!seed) seed = Math.random().toString(36).substr(2, 5)
  if(!n && slugify){
    seed = slug(seed, {lower: true})
  }

  let seedToCheck = n ? seed +'-' + n : seed
  return new Promise((resolve) => resolve(checkIfExistsPromise(seedToCheck)))
  .then(res => {
    if(!res){ // found it if not exists
      return seedToCheck
    }
    return uniqueSlugByIncrement(seed, checkIfExistsPromise, n+1, false)
  })
}

// -------------------------------------------------------------------------------------


module.exports = {
  filterObject,
  idForKeyValue,
  parsePagTotalAggResult,
  idArrToObjectIdArr,
  guaranteeArr,
  isEmptyArray,
  checkNonEmptyProperties,
  isFieldValueUnique,
  checkUniqueFieldValue,
  generateUniqueSlug,
  findOnePartial,
  uniqueSlugByIncrement,
  slugifyObjProperties,

}
