const { GraphQLScalarType } = require('graphql')
// scalars
const json = require('graphql-type-json')
const moment = require('moment')

const date = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue: (value) => moment(value).toDate(), // value from the client
  serialize: (value) => value.getTime(), // value sent to the client
  parseLiteral: (ast) => ast
})

const resolvers = {
  JSON: json,

  Date: date,

  Paginated: {
    __resolveType(obj, context, info){
      if(obj.type == "SIMPLE"){
        return 'SimpleProduct'
      }
      return null
    }
  },

  VariableFeature: {
    __resolveType(obj, context, info){
      if(obj.id){
        return 'VariableFeatureSet'
      }
      return 'ProductVariableFeature'
    }
  },
}

module.exports = resolvers
