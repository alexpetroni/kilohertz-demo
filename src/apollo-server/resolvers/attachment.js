const resolvers = {
  Query: {
    attachment (_, { id }, context) {
      return context.models.Attachment.attachment(id)
    },

    attachmentBySlug (_, { slug }, context) {
      return context.models.Attachment.attachmentBySlug(slug)
    },

    attachments (_, { idArr }, context) {
      return context.models.Attachment.attachments(idArr)
    },

    attachmentsBySlug (_, { slugArr }, context) {
      return context.models.Attachment.attachmentsBySlug(slugArr)
    },

    searchAttachments (_, { args }, context) {
      return context.models.Attachment.searchAttachments(args)
    },

    paginatedAttachments (_, { args }, context) {
      return context.models.Attachment.paginatedAttachments(args)
    },
  },

  Mutation: {
    createAttachment(_, { input }, context){
      return context.models.Attachment.createAttachment(input)
    },

    updateAttachment(_, { id, input }, context){
      return context.models.Attachment.updateAttachment(id, input)
    },

    deleteAttachment(_, { id }, context){
      return context.models.Attachment.deleteAttachment(id)
    },

    deleteAttachments(_, { idArr }, context){
      return context.models.Attachment.deleteAttachments(idArr)
    },
  }
}



module.exports = resolvers
