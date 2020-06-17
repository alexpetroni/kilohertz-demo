const typeDef = `

  extend type Query {
    variableFeatureSet(id: ID!): VariableFeatureSet
    variableFeatureSetBySlug(slug: String!): VariableFeatureSet

    variableFeatureSets(idArr: [ID!]!): [VariableFeatureSet!]!
    variableFeatureSetsBySlug(slugArr: [String!]!): [VariableFeatureSet!]!

    paginatedVariableFeatureSets(args: JSON): PaginatedVariableFeatureSets!

    variableFeatureSetsList: [VariableFeatureSet!]!
  }

  extend type Mutation {
    createVariableFeatureSet(input: VariableFeatureSetInput!): VariableFeatureSet
    updateVariableFeatureSet(id: ID!, input: VariableFeatureSetInput!): VariableFeatureSet
    deleteVariableFeatureSet(id: ID!): ID
    deleteVariableFeatureSets(idArr: [ID!]!): [ID!]!
  }

  enum VariableFeatureType {
    TEXT
    COLOR_HEX
    IMAGE
    SVG
  }

  #  ---- used byVariableFeatureSet && ProductVariableFeature (a subset of a VariableFeatureSet) ---
  interface VariableFeature {
    name: String
    slug: String
    description: String
    type: VariableFeatureType!
    items: [VariableFeatureItem!]
  }

  type VariableFeatureSet implements VariableFeature{
    id: ID!
    createdAt: Date
    updatedAt: Date
    name: String
    slug: String
    description: String
    type: VariableFeatureType!
    items: [VariableFeatureItem!]
  }

  input VariableFeatureSetInput {
    name: String
    slug: String
    description: String
    type: VariableFeatureType
    items: [VariableFeatureItemInput!]
  }

  type VariableFeatureItem {
    name: String
    slug: String
    description: String
    value: String
  }

  input VariableFeatureItemInput {
    name: String
    slug: String
    description: String
    value: String
  }

  type PaginatedVariableFeatureSets{
    total: Int
    items: [VariableFeatureSet!]!
  }
`
module.exports = typeDef
