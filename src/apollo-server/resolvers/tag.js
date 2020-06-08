const resolvers = {
  Query: {
    tag (_, { id }, context) {
      return context.models.Tag.tag(id)
    },

    tagBySlug (_, { slug }, context) {
      return context.models.Tag.tagBySlug(slug)
    },

    tags (_, { idArr }, context) {
      return context.models.Tag.tags(idArr)
    },

    tagsBySlug (_, { slugArr }, context) {
      return context.models.Tag.tagsBySlug(slugArr)
    },

    searchTags (_, { args }, context) {
      return context.models.Tag.searchTags(args)
    },

    paginatedTags (_, { args }, context) {
      return context.models.Tag.paginatedTags(args)
    },
  },

  Mutation: {
    createTag(_, { input }, context){
      return context.models.Tag.createTag(input)
    },

    updateTag(_, { id, input }, context){
      return context.models.Tag.updateTag(id, input)
    },

    deleteTag(_, { id }, context){
      return context.models.Tag.deleteTag(id)
    },

    deleteTags(_, { idArr }, context){
      return context.models.Tag.deleteTags(idArr)
    },
  }
}



module.exports = resolvers
