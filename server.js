const { ApolloServer, PubSub, gql } = require("apollo-server");
const uuidv4 = require("uuid/v4");
const axios = require("axios");
const MESSAGE_ADDED = "MESSAGE_ADDED";
// PubSub is a class that exposes a simple publish and subscribe API.

// It sits between your application’s logic and the GraphQL subscriptions engine - it receives a publish command from your app logic and pushes it to your GraphQL execution engine.
const pubsub = new PubSub();

// const { typeDefs } = require("./typeDefs");
// const { resolvers } = require("./resolvers");

const server = new ApolloServer({
  context: {
    pubsub
  },
  typeDefs: gql`
    type Message {
      id: ID!
      quote: String!
      author: String!
    }
    type Query {
      messages: [Message!]!
    }
    # inside our resolver map, we add a Subscription resolver that returns an AsyncIterator, which listens to the events asynchronously
    type Subscription {
      messageAdded: Message
    }
  `,
  resolvers: {
    Subscription: {
      messageAdded: {
        subscribe: async (_, args, { pubsub }) => {
          const { data } = await axios.get("https://talaikis.com/api/quotes");
          let i = 0;
          setInterval(() => {
            // Use your PubSub instance for publishing new data over your subscriptions transport
            const payload = {
              messageAdded: {
                id: uuidv4(),
                quote: data[i].quote,
                author: data[i].author
              }
            };
            i += 1;
            // you can publish data to your topic by using pubsub.publish with the topic name and the payload you want to publish:
            pubsub.publish(MESSAGE_ADDED, payload);
          }, 10000);
          // the subscription resolver method must return AsyncIterator, which you can get from using asyncIterator method of your PubSub:
          return pubsub.asyncIterator(MESSAGE_ADDED);
        }
      }
    }
  }
});

server.listen(8000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
