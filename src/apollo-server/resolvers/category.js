const resolvers = {
  Query: {
    category (_, { id }, context) {
      return context.models.Category.category(id)
    },

    categories (_, { args }, context) {
      return context.models.Category.categories(args)
    },

    searchCategories (_, { args }, context) {
      return context.models.Category.searchCategories(args)
    },

    paginatedCategories (_, { args }, context) {
      return context.models.Category.paginatedCategories(args)
    },
  },

  Mutation: {
    createCategory(_, { input }, context){
      return context.models.Category.createCategory(input)
    },

    updateCategory(_, { id, input }, context){
      return context.models.Category.updateCategory(id, input)
    },

    updateCategories(_, { inputArr }, context){
      return context.models.Category.updateCategories(inputArr)
    },

    deleteCategory(_, { id }, context){
      return context.models.Category.deleteCategory(id)
    },

    deleteCategories(_, { idArr }, context){
      return context.models.Category.deleteCategories(idArr)
    },
  }
}



module.exports = resolvers
