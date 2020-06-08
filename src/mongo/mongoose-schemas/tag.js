const { buildTimestampSchema } = require('./../utils')

const schemaDefinition = {
  name: {
    type: String
  },

  slug: {
    type: String,
    index: true,
    unique: true,
  }
}

module.exports = buildTimestampSchema(schemaDefinition)
