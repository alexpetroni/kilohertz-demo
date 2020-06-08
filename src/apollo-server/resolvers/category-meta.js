const resolvers = {
  Query: {
    categoryMeta (_, { id }, context) {
      return context.models.CategoryMeta.categoryMeta(id)
    },

    categoriesMeta (_, { idArr }, context) {
      return context.models.CategoryMeta.categoriesMeta(idArr)
    },
  },

  Mutation: {
    updateCategoryMeta(_, { id, input }, context){
      return context.models.CategoryMeta.updateCategoryMeta(id, input)
    },

    deleteCategoryMeta(_, { id }, context){
      return context.models.CategoryMeta.deleteCategoryMeta(id)
    },

    deleteCategoriesMeta(_, { idArr }, context){
      return context.models.CategoryMeta.deleteCategoriesMeta(idArr)
    },
  }
}

module.exports = resolvers
