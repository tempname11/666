import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Message from '../Message';
import './index.scss';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { messages } = this.props;
    return (
      <ul className="messages">
        {messages.map((message, index) =>
          <Message
            message={message}
            key={index}
          />
        )}
      </ul>
    );
  },
});

