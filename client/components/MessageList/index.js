import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Message from '../Message';
import './index.scss';
import * as ChunkTree from '../../../common/ChunkTree';

const Chunk = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { value, users, ourUserID } = this.props;
    return ChunkTree.isTree(value) ? (
      <div>
        {value.map(subvalue => (
          <Chunk
            value={subvalue}
            users={users}
            ourUserID={ourUserID}
            key={subvalue.chunkTreeID}
          />
        ))}
      </div>
    ) : (
      <Message
        message={value}
        user={users[value.userID]}
        isOurMessage={ourUserID === value.userID}
        key={value.messageID}
      />
    );
  },
});

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { messageTree, users, ourUserID } = this.props;
    return (
      <ul className="messages">
        <Chunk
          value={messageTree}
          users={users}
          ourUserID={ourUserID}
          key={messageTree.chunkTreeID}
        />
      </ul>
    );
  },
});
