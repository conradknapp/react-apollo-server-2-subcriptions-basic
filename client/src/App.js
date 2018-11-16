import React, { useEffect } from "react";
import gql from "graphql-tag";
import { Query, Subscription } from "react-apollo";

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      id
      content
    }
  }
`;

const App = () => (
  <Subscription subscription={MESSAGE_ADDED}>
    {({ data, loading }) => {
      if (!data) return null;
      if (loading) return <div>Loading...</div>;

      return <div>{data.messageAdded.content}</div>;
    }}
  </Subscription>
);

// const App = () => {
//   return (
//     <Query query={GET_MESSAGES}>
//       {({ data, loading, subscribeToMore }) => {
//         if (!data) return null;
//         if (loading) return <div>Loading...</div>;

//         return (
//           <Messages
//             messages={data.messages}
//             subscribeToMore={subscribeToMore}
//           />
//         );
//       }}
//     </Query>
//   );
// };

// const Messages = ({ messages, subscribeToMore }) => {
//   useEffect(() => {
//     subscribeToMore({
//       document: MESSAGE_ADDED,
//       updateQuery: (prev, { subscriptionData }) => {
//         if (!subscriptionData.data) return prev;

//         return {
//           messages: [subscriptionData.data.messageAdded, ...prev.messages]
//         };
//       }
//     });
//   }, []);

//   return (
//     <ul>
//       {messages.map(message => (
//         <li key={message.id}>{message.content}</li>
//       ))}
//     </ul>
//   );
// };

export default App;
