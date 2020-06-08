const { Category, CategoryMeta } = require('./../mongo/models')

const utils = require('./utils')
const aggExpr = require('./aggregation')

// function findCategoriesMetaQuery (args = {}) {
//   const filter = Object.assign({}, utils.parseQuerySearchTerm(args), ...utils.parseQueryFilters(args))
//
//   const sort = utils.parseQuerySort(args)
//   const fields = utils.parseQueryFields(args)
//
//   const q = CategoryMeta.find(filter)
//   if(sort) q.sort(sort)
//   if(fields) q.select(fields)
//
//   if(args.limit && args.limit != -1){
//     q.limit(args.limit)
//   }
//
//   return q
// }

const model = {

  async categoryMeta (id) {
    let res = await CategoryMeta.findOne({category:id}).populate('category')
    // if no meta, get an 'empty one'
    if(!res){
      let category = await Category.findById(id).lean()

      if(!category) {
        throw new Error(`No category with id ${id}`)
      }

      res = {
        category: {
          id: id,
          name: category.name
        },
        previewFields: [
          {title: '', content: ''},
          {title: '', content: ''},
          {title: '', content: ''},
        ],
        title: '',
        description: '',
        highlights: []
      }
    }

    return res
  },

  async categoriesMeta (idArr) {
    return await CategoryMeta.find({"category": {$in: idArr}}).populate("category")
  },

  async updateCategoryMeta (id, item) {
    let parsed = Object.assign({}, item)
    await CategoryMeta.findOneAndUpdate({category: id}, parsed,  { new: true, upsert: true })
    return await CategoryMeta.findOne({category: id}).populate('category')
  },

  async deleteCategoryMeta (id) {
    const del = await CategoryMeta.findOneAndRemove({category: id})
    return id
  },

  async deleteCategoriesMeta (idArr) {
    const del = await CategoryMeta.deleteMany({category: {$in: idArr }})
    return idArr
  },

}

module.exports = model
