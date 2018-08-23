const MESSAGE_CREATED = "MESSAGE_CREATED";

exports.resolvers = {
  Query: {
    messages: () => [{ id: 0, content: "Hello!" }, { id: 1, content: "Bye!" }]
  },
  Subscription: {
    messageCreated: {
      subscribe: (_, args, { pubsub }) => {
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
        return pubsub.asyncIterator(MESSAGE_CREATED);
      }
    }
  }
};
