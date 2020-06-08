const typeDef = `

  extend type Query {
    productAttachmentsSet(field: String!, value: String!, name: String!): ProductAttachmentsSet
    productAttachmentsSets(field: String!, value: String!, nameArr: [String!]): [ProductAttachmentsSet!]!
  }

  extend type Mutation {
    updateProductAttachmentsSet(input: ProductAttachmentsSetInput!): ProductAttachmentsSet
    deleteProductAttachmentsSet(id: ID!): ID
    deleteProductAttachmentsSets(idArr:[ID!]!): [ID!]!
    deleteAllAttachmentsSetsForProduct(productId: ID!): ID!
  }

  type ProductAttachmentsSet {
    id: ID!
    createdAt: Date
    updatedAt: Date
    product: String! # productId
    name: String!
    attachments: [String!]!
  }

  input ProductAttachmentsSetInput {
    product: ID!
    name: String!
    attachments: [ID!]
  }

`
module.exports = typeDef
