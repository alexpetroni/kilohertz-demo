
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
    attachments: [AttSetItem!]!
  }

  input ProductAttachmentsSetInput {
    product: ID!
    name: String!
    attachments: [AttSetItemInput!]
  }

  type AttSetItem {
    type: String
    path: String
    title: String
  }




  input AttSetItemInput {
    type: String
    path: String
    title: String
  }

`
module.exports = typeDef
