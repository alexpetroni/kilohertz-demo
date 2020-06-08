const { buildTimestampSchema } = require('./../utils')

const schemaDefinition = {

    filename: {
      type: String
    },

    format: {
      type: String
    },

    folder: {
      type: String
    },

    mimetype: {
      type: String
    },

    type: {
      type: String
    },

    tags: {
      type: [String]
    },

    title: {
      type: String
    },

    description: {
      type: String
    },

    url: {
      type: String
    },

    secureUrl: {
      type: String
    },

    // original image width and height
    width: {
      type: Number
    },

    height: {
      type: Number
    },
}

module.exports = buildTimestampSchema(schemaDefinition)
