const uuidv4 = require("uuid/v4");
const axios = require("axios");
const MESSAGE_ADDED = "MESSAGE_ADDED";

exports.resolvers = {
  Query: {
    messages: () => [
      { id: 0, content: "Hello!" },
      {
        id: 1,
        content: `The local time is: ${new Date().toLocaleTimeString()}`
      }
    ]
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, args, { pubsub }) => {
        setInterval(async () => {
          const { data } = await axios.get(
            "https://talaikis.com/api/quotes/random/"
          );
          pubsub.publish(MESSAGE_ADDED, {
            messageAdded: {
              id: uuidv4(),
              content: data.quote
            }
          });
        }, 5000);
        // The subscription resolver method must return AsyncIterator, which you can get from using asyncIterator method of your PubSub:
        return pubsub.asyncIterator(MESSAGE_ADDED);
      }
    }
  }
};
