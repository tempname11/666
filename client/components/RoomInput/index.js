import { connect } from 'react-redux';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { sendMessage } from '../../smartActions';
import { roomInputChange, togglePreview } from '../../actions';
import './index.scss';

function wrapKeyPress(e, handler) {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    handler();
  }

  const roomMessages = document.getElementById('roomMessages');
  if (roomMessages !== null) {
    roomMessages.scrollTop = roomMessages.scrollHeight;
  }
}

function wrapClick(e, handler) {
  e.preventDefault();
  handler();
}

class RoomInput extends Component {
  componentDidUpdate() {
    const textarea = findDOMNode(this.refs.textarea);
    textarea.style.height = '';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  render() {
    const { text, buttonEnabled, previewCollapsed, changeInputChange,
            clickTogglePreview, keySendMessage, clickSendMessage } = this.props;
    return (
      <form className="room-actions"
        onSubmit={clickSendMessage}>
        <textarea
          type="text"
          ref="textarea"
          placeholder="Message..."
          className="room-actions-input input"
          onChange={changeInputChange}
          onKeyPress={keySendMessage}
          rows="1"
          value={text}
        ></textarea>
        <button
          className={`btn ${ previewCollapsed ? 'is-off' : ''}`}
          onClick={clickTogglePreview}
        > Preview </button>
        <button
          className="room-actions-send btn"
          type="submit"
          ref="submitBtn"
          disabled={!buttonEnabled}
        > Send </button>
      </form>
    );
  }
}

export default connect(state => {
  const text = state.ui.roomInputText;
  const { previewCollapsed } = state.ui;

  return {
    buttonEnabled: !!text,
    previewCollapsed,
    text,
  };
}, dispatch => {
  return {
    clickTogglePreview: e => wrapClick(e, () => dispatch(togglePreview())),
    keySendMessage: e => wrapKeyPress(e, () => dispatch(sendMessage())),
    clickSendMessage: e => wrapClick(e, () => dispatch(sendMessage())),
    changeInputChange: e => dispatch(roomInputChange(e.target.value)),
  };
})(RoomInput);
