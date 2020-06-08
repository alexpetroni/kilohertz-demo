const resolvers = {
  Query: {
    family (_, { id }, context) {
      return context.models.Family.family(id)
    },

    familyBySlug (_, { slug }, context) {
      return context.models.Family.familyBySlug(slug)
    },

    families (_, { idArr }, context) {
      return context.models.Family.families(idArr)
    },

    familiesBySlug (_, { slugArr }, context) {
      return context.models.Family.familiesBySlug(slugArr)
    },

    searchFamilies (_, { args }, context) {
      return context.models.Family.searchFamilies(args)
    },

    paginatedFamilies (_, { args }, context) {
      return context.models.Family.paginatedFamilies(args)
    },
  },

  Mutation: {
    createFamily (_, { input }, context){
      return context.models.Family.createFamily(input)
    },

    updateFamily (_, { id, input }, context){
      return context.models.Family.updateFamily(id, input)
    },

    deleteFamily (_, { id }, context){
      return context.models.Family.deleteFamily(id)
    },

    deleteFamilies (_, { idArr }, context){
      return context.models.Family.deleteFamilies(idArr)
    }
  },
}

module.exports = resolvers
