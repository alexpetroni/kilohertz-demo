const resolvers = {
  Query: {
    brand (_, { id }, context) {
      return context.models.Brand.brand(id)
    },

    brandBySlug (_, { slug }, context) {
      return context.models.Brand.brandBySlug(slug)
    },

    brands (_, { idArr }, context) {
      return context.models.Brand.brands(idArr)
    },

    allBrands (_, {}, context) {
      return context.models.Brand.allBrands()
    },

    brandsBySlug (_, { slugArr }, context) {
      return context.models.Brand.brandsBySlug(slugArr)
    },

    searchBrands (_, { args }, context) {
      return context.models.Brand.searchBrands(args)
    },

    paginatedBrands (_, { args }, context) {
      return context.models.Brand.paginatedBrands(args)
    },
  },

  Mutation: {
    createBrand(_, { input }, context){
      return context.models.Brand.createBrand(input)
    },

    updateBrand(_, { id, input }, context){
      return context.models.Brand.updateBrand(id, input)
    },

    deleteBrand(_, { id }, context){
      return context.models.Brand.deleteBrand(id)
    },

    deleteBrands(_, { idArr }, context){
      return context.models.Brand.deleteBrands(idArr)
    },
  }
}



module.exports = resolvers
