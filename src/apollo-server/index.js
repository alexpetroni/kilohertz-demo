const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./type-definitions')
const resolvers = require('./resolvers')
const models =  require('./../models')

const server = new ApolloServer({
typeDefs,
resolvers,
context: ({ req }) => {
  return {
  //  user: req.user,
  models,
  }
},
 debug: true,
 tracing: true,
 introspection: true,
 playground: true
})

module.exports = server
