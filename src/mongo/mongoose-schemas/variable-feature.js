const { buildTimestampSchema } = require('./../utils')

// const vfiSchema = require('./variable-feature-item')
// const VariableFeatureItem = new Schema(vfiSchema)

const schemaDefinition = {
    name: {
      type: String,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    type: {
      type: String,
      default: 'TEXT',
    },

    description: {
      type: String
    },

    items: [{
        name: String,
        slug: String,
        description: String,
        value: String,
      }]
  }

module.exports = buildTimestampSchema(schemaDefinition)
