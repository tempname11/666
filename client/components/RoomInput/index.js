import { connect } from 'react-redux';
import React, { findDOMNode, Component } from 'react';
import { sendMessage } from '../../smartActions';
import { roomInputChange, togglePreview } from '../../actions';
import './index.scss';

function onKeyPress(e, handler) {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    handler();
  }
}

function onClick(e, handler) {
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
    const { dispatch, text, buttonEnabled } = this.props;
    return (
      <form className="room-actions"
        onSubmit={e => onClick(e, () => dispatch(sendMessage()))}>
        <textarea
          type="text"
          ref="textarea"
          placeholder="Message..."
          className="room-actions-input input"
          onChange={e => dispatch(roomInputChange(e.target.value))}
          onKeyPress={e => onKeyPress(e, () => dispatch(sendMessage()))}
          rows="1"
          value={text}
        ></textarea>
        <button
          className="btn"
          onClick={e => onClick(e, () => dispatch(togglePreview()))}
          disabled={!buttonEnabled}
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

  return {
    buttonEnabled: !!text,
    text,
  };
})(RoomInput);
