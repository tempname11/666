import { connect } from 'react-redux';
import React, { Component } from 'react';
import { createSelector } from 'reselect';
import RoomHeader from '../RoomHeader';
import MessageList from '../MessageList';
import Message from '../Message';
import RoomInput from '../RoomInput';
import './index.scss';

class Room extends Component {
  render() {
    const {
      room,
      messageChunks,
      users,
      ourUserID,
      previewMessage,
      showPreview,
    } = this.props;

    const ourUser = users[ourUserID];

    return (
      <div className="room">
        <RoomHeader room={room} />
        <div className="room-messages" id="roomMessages">
          {!showPreview ? false :
            <div className="room-messages-preview">
              <Message message={previewMessage}
                       user={ourUser} isOurMessage={false} />
            </div>
          }
          <MessageList messageChunks={messageChunks}
            users={users} ourUserID={ourUserID} />
        </div>
        <RoomInput />
      </div>
    );
  }
}

const getMessageChunks = (state, props) => props.room.messageChunks;
const getRoom = (state, props) => props.room;
const getUsers = (state, props) => props.room.roomUsers;
const getOurUserID = (state, props) => props.room.userID;
const getInputText = state => state.ui.roomInputText;
const getPreviewCollapsed = state => state.ui.previewCollapsed;

const selectPreviewMessage = createSelector(
  getInputText,
  inputText => {
    return {
      text: inputText,
      time: null,
      status: 'preview',
      attachments: [],
    };
  }
);

const selector = createSelector(
  getRoom,
  getMessageChunks,
  getUsers,
  getOurUserID,
  getInputText,
  getPreviewCollapsed,
  selectPreviewMessage,
  (room, messageChunks, users, ourUserID, inputText, previewCollapsed, previewMessage) => {
    return {
      room,
      messageChunks,
      users,
      ourUserID,
      previewMessage,
      showPreview: !!inputText && !previewCollapsed,
    };
  }
);

export default connect(selector)(Room);

