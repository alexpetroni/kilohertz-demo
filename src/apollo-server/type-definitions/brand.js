const typeDef = `

  extend type Query {
    brand(id: ID!): Brand
    brandBySlug(slug: String!): Brand

    brands(idArr: [ID!]!): [Brand!]!
    allBrands: [Brand!]!
    brandsBySlug(slugArr: [String!]!): [Brand!]!
    searchBrands(args: JSON): [Brand!]!
    paginatedBrands(args: JSON): PaginatedBrands!
  }

  extend type Mutation {
    createBrand(input: BrandInput!): Brand
    updateBrand(id: ID!, input: BrandInput!): Brand
    deleteBrand(id: ID!): ID
    deleteBrands(idArr: [ID!]!): [ID!]!
  }

  type Brand {
    id: ID!
    createdAt: Date
    updatedAt: Date
    name: String
    slug: String
    logo: String
  }

  input BrandInput {
    name: String
    slug: String
    logo: String
  }

  type PaginatedBrands {
    total: Int
    items: [Brand!]!
  }
`
module.exports = typeDef
