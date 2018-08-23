const { ApolloServer, PubSub } = require("apollo-server");

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    pubsub
  }
});

server.listen(8000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
