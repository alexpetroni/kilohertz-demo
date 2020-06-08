const typeDef = `

  extend type Query {
    attachment(id: ID!): Attachment
    attachmentBySlug(slug: String!): Attachment

    attachments(idArr: [ID!]!): [Attachment!]!
    attachmentsBySlug(slugArr: [String!]!): [Attachment!]!
    searchAttachments(args: JSON): [Attachment!]!
    paginatedAttachments(args: JSON): PaginatedAttachments!
  }

  extend type Mutation {
    createAttachment(input: AttachmentInput!): Attachment
    updateAttachment(id: ID!, input: AttachmentInput!): Attachment
    deleteAttachment(id: ID!): ID
    deleteAttachments(idArr: [ID!]!): [ID!]!
  }

  type Attachment {
    fileId: ID!
    type: String
    name: String
    filePath: String
    tags: [String]
    isPrivateFile: Boolean
    url: String
    thumbnail: String
    fileType: String
  }

  input AttachmentInput {
    fileId: ID!
    type: String
    name: String
    filePath: String
    tags: [String]
    isPrivateFile: Boolean
    url: String
    thumbnail: String
    fileType: String
  }

  type PaginatedAttachments {
    total: Int
    items: [Attachment!]!
  }
`
module.exports = typeDef
