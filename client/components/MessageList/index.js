import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Message from '../Message';
import './index.scss';

const Chunk = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { chunk, users, ourUserID } = this.props;
    return (
      <div>
        {chunk.map(message =>
          <Message
            message={message}
            user={users[message.userID]}
            isOurMessage={ourUserID === message.userID}
            key={message.messageID}
          />
        )}
      </div>
    );
  },
});

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { messageChunks, users, ourUserID } = this.props;
    return (
      <ul className="messages">
        {messageChunks.map((chunk, index) =>
          <Chunk
            chunk={chunk}
            users={users}
            ourUserID={ourUserID}
            key={index}
          />
        )}
      </ul>
    );
  },
});

