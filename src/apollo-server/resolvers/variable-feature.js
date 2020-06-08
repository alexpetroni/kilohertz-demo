const resolvers = {
  Query: {
    variableFeatureSet (_, { id }, context) {
      return context.models.VariableFeature.variableFeatureSet(id)
    },

    variableFeatureSetBySlug (_, { slug }, context) {
      return context.models.VariableFeature.variableFeatureSetBySlug(slug)
    },

    variableFeatureSets (_, { idArr }, context) {
      return context.models.VariableFeature.variableFeatureSets(idArr)
    },

    variableFeatureSetsBySlug (_, { slugArr }, context) {
      return context.models.VariableFeature.variableFeatureSetsBySlug(slugArr)
    },

    paginatedVariableFeatureSets (_, { args }, context) {
      return context.models.VariableFeature.paginatedVariableFeatureSets(args)
    },

    variableFeatureSetsList (_, { }, context) {
      return context.models.VariableFeature.variableFeatureSetsList()
    },

  },

  Mutation: {
    createVariableFeatureSet(_, { input }, context){
      return context.models.VariableFeature.createVariableFeatureSet(input)
    },

    updateVariableFeatureSet(_, { id, input }, context){
      return context.models.VariableFeature.updateVariableFeatureSet(id, input)
    },

    deleteVariableFeatureSet(_, { id }, context){
      return context.models.VariableFeature.deleteVariableFeatureSet(id)
    },

    deleteVariableFeatureSets(_, { idArr }, context){
      return context.models.VariableFeature.deleteVariableFeatureSets(idArr)
    },
  }
}



module.exports = resolvers
