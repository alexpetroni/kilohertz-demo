const typeDef = `

  extend type Query {
    family(id: ID!): Family
    familyBySlug(slug: String!): Family

    families(idArr: [ID!]!): [Family!]!
    familiesBySlug(slugArr: [String!]!): [Family!]!
    searchFamilies(args: JSON): [Family!]!
    paginatedFamilies(args: JSON): PaginatedFamilies!
  }

  extend type Mutation {
    createFamily(input: FamilyInput!): Family
    updateFamily(id: ID!, input: FamilyInput!): Family
    deleteFamily(id: ID!): ID
    deleteFamilies(idArr: [ID!]!): [ID!]!
  }

  type Family {
    id: ID!
    createdAt: Date
    updatedAt: Date
    name: String
    slug: String
    products: [Product!]!
  }

  input FamilyInput {
    name: String
    slug: String
    products: [String!]
  }

  type PaginatedFamilies {
    total: Int
    items: [Family!]!
  }
`
module.exports = typeDef
