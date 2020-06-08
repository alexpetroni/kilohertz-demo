const typeDef = `

  extend type Query {
    categoryMeta(id: ID!): CategoryMeta    # id is the parent Category
    categoriesMeta(idArr: [ID!]!): [CategoryMeta!]!
    searchCategoriesMeta(args: JSON): [CategoryMeta!]!
  }

  extend type Mutation {
    updateCategoryMeta(id: ID!, input: CategoryMetaInput!): CategoryMeta
    deleteCategoryMeta(id: ID!): ID
    deleteCategoriesMeta(idArr: [ID!]!): [ID!]!
  }

  type CategoryMeta {
    id: ID!
    category: Category
    previewFields: [CategoryMetaPreview]
    title: String
    description: String
    highlights: [CategoryMetaHighlights!]
  }

  input CategoryMetaInput {
    title: String
    description: String
    previewFields: [CategoryMetaPreviewInput]
    highlights: [CategoryMetaHighlightsInput]
  }

  type CategoryMetaPreview {
    title: String
    content: String
    image: String
  }

  input CategoryMetaPreviewInput {
    title: String
    content: String
    image: String
  }

  type CategoryMetaHighlights {
    title: String
    content: String
  }

  input CategoryMetaHighlightsInput {
    title: String
    content: String
  }

  type PaginatedCategoriesMeta{
    total: Int,
    items: [CategoryMeta!]!
  }

`
module.exports = typeDef
