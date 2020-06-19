const typeDef = `
  extend type Query {
    linkedProducts(field: String!, value: String!, linkType: String!): ProductLinks
  }

  extend type Mutation {
    updateLinkedProducts(productId: ID!, linkType: String!, inputArr: [LinkedProductInput!]!): ProductLinks
    deleteLinkedProducts(id: ID!): ID # delete based on collection id
    deleteAllLinkedProducts(productId: ID!): ID # delete based on product id
  }

  type ProductLinks {
    id: ID!
    links: [LinkedProduct!]
  }

  type LinkedProduct {
    product: Product!
    variationsSku: [String!]
  }

  input LinkedProductInput {
    product: String!
    variationsSku: [String!]
  }
`
module.exports = typeDef
