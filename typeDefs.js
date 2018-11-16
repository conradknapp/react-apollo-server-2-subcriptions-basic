const { gql } = require("apollo-server");

exports.typeDefs = gql`
  type Message {
    id: ID!
    content: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Subscription {
    messageAdded: Message
  }
`;
