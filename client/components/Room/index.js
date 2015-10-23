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
    const { previewMessage, messages, showPreview, room } = this.props;

    return (
      <div className="room">
        <RoomHeader room={room} />
        <div className="room-messages" id="roomMessages">
          {!showPreview ? false :
            <div className="room-messages-preview">
              <Message message={previewMessage} />
            </div>
          }
          <MessageList messages={messages} />
        </div>
        <RoomInput />
      </div>
    );
  }
}

const getRoom = (state, props) => props.room;
const getInputText = state => state.ui.roomInputText;
const getPreviewCollapsed = state => state.ui.previewCollapsed;

const selectMessages = createSelector(
  getRoom,
  room => {
    const { orderedMessages, roomMessages, roomUsers, userID: ourUserID } = room;

    return orderedMessages.map(messageID => {
      const { text, time, userID,
              status, attachments } = roomMessages[messageID];
      const { nick, avatar } = roomUsers[userID] ? roomUsers[userID] : {
        nick: 'Leaved user',
        avatar: '', // TODO link to our logo with anonym man
      };

      const isOurMessage = (ourUserID === userID);

      return {
        text,
        time,
        nick,
        isOurMessage,
        avatar,
        status,
        attachments,
      };
    });
  }
);

const selectPreviewMessage = createSelector(
  getRoom,
  getInputText,
  (room, inputText) => {
    const {nick: ourNick, avatar: ourAvatar} = room.roomUsers[room.userID];
    return {
      text: inputText,
      time: null,
      nick: ourNick,
      avatar: ourAvatar,
      status: 'preview',
      attachments: [],
    };
  }
);

const selector = createSelector(
  getRoom,
  selectMessages,
  getInputText,
  getPreviewCollapsed,
  selectPreviewMessage,
  (room, messages, inputText, previewCollapsed, previewMessage) => {
    return {
      showPreview: !!inputText && !previewCollapsed,
      messages,
      previewMessage,
    };
  }
);

export default connect(selector)(Room);

