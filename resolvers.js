const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const MESSAGE_CREATED = "MESSAGE_CREATED";

let id = 2;

setInterval(() => {
  pubsub.publish(MESSAGE_CREATED, {
    messageCreated: {
      id,
      content: new Date().toLocaleTimeString()
    }
  });

  id++;
}, 2000);

exports.resolvers = {
  Query: {
    messages: () => [{ id: 0, content: "Hello!" }, { id: 1, content: "Bye!" }]
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED)
    }
  }
};
