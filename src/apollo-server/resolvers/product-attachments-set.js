const resolvers = {
  Query: {
    productAttachmentsSet (_, { field, value, name }, context) {
      return context.models.ProductAttachmentsSet.productAttachmentsSet(field, value, name)
    },

    productAttachmentsSets (_, { field, value, nameArr }, context) {
      return context.models.ProductAttachmentsSet.productAttachmentsSets(field, value, nameArr)
    },
  },

  Mutation: {
    updateProductAttachmentsSet(_, { input }, context){
      return context.models.ProductAttachmentsSet.updateProductAttachmentsSet(input)
    },

    deleteProductAttachmentsSet(_, { id }, context){
      return context.models.ProductAttachmentsSet.deleteProductAttachmentsSet(id)
    },

    deleteProductAttachmentsSets(_, { idArr }, context){
      return context.models.ProductAttachmentsSet.deleteProductAttachmentsSets(idArr)
    },

    deleteAllAttachmentsSetsForProduct(_, { productId }, context){
      return context.models.ProductAttachmentsSet.deleteAllAttachmentsSetsForProduct(productId)
    },
  }
}

module.exports = resolvers
