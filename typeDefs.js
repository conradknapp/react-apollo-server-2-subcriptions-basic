const { gql } = require("apollo-server");

exports.typeDefs = gql`
  type Message {
    id: ID!
    quote: String!
    author: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Subscription {
    messageAdded: Message
  }
`;
