import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Message from '../Message';
import './index.scss';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { messages, users, ourUserID } = this.props;
    return (
      <ul className="messages">
        {messages.map(message =>
          <Message
            message={message}
            user={users.get(message.userID)}
            isOurMessage={ourUserID === message.userID}
            key={message.messageID}
          />
        )}
      </ul>
    );
  },
});

