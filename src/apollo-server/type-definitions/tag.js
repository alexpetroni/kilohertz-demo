const typeDef = `

  extend type Query {
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag

    tags(idArr: [ID!]!): [Tag!]!
    tagsBySlug(slugArr: [String!]!): [Tag!]!
    searchTags(args: JSON): [Tag!]!
    paginatedTags(args: JSON): PaginatedTags!
  }

  extend type Mutation {
    createTag(input: TagInput!): Tag
    updateTag(id: ID!, input: TagInput!): Tag
    deleteTag(id: ID!): ID
    deleteTags(idArr: [ID!]!): [ID!]!
  }

  type Tag {
    id: ID!
    createdAt: Date
    updatedAt: Date
    name: String
    slug: String
  }

  input TagInput {
    name: String
    slug: String
  }

  type PaginatedTags {
    total: Int
    items: [Tag!]!
  }
`
module.exports = typeDef
