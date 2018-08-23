import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from "./App";

// We need two links to support WebSockets--an httpLink and wsLink
// http link is used to send http requests over network
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql"
});

// wsLink used to connect to websocket link to consume data over websockets
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql`,
  options: {
    reconnect: true
  }
});

// this split link will check to see if our operation is a subscription; if it is, we'll use wsLink to handle the network, otherwise we'll use httpLink
const terminatingLink = split(
  ({ query }) => {
    // if the operation is a subscription, the link will return the wsLink
    // if the operation isn't, the link will return httpLink
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
