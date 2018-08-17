import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const COMMENT_ADDED = gql`
  subscription {
    messageCreated {
      id
      content
    }
  }
`;

const App = () => (
  <Query query={GET_MESSAGES}>
    {({ data, loading, subscribeToMore }) => {
      if (!data) return null;
      if (loading) return <div>Loading ...</div>;

      return (
        <Messages messages={data.messages} subscribeToMore={subscribeToMore} />
      );
    }}
  </Query>
);

class Messages extends React.Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: COMMENT_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          messages: [subscriptionData.data.messageCreated, ...prev.messages]
        };
      }
    });
  }

  render() {
    const { messages } = this.props;

    return (
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    );
  }
}

export default App;
