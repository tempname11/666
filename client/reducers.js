import { combineReducers } from 'redux';
import * as actions from 'actions';
import { routerStateReducer } from 'redux-router';
import * as ChunkList from '../common/ChunkList';

/*
  topRooms: [{
    roomID: string,
    name: string,
    users: number,
    rating: number,
  }] || null,
*/
function topRooms(state = null, action) {
  switch (action.type) {
    case actions.UPDATE_TOP_ROOMS: return action.rooms;
    default: return state;
  }
}

function joinUser(room, action) {
  const {userID} = action;
  return {
    ...room,
    roomUsers: {
      ...room.roomUsers,
      [userID]: action.user,
    },
  };
}

function leaveUser(room, action) {
  const {userID} = action;
  const users = room.roomUsers;
  const newUsers = Object.assign({}, users);
  delete newUsers[userID];
  return {
    ...room,
    roomUsers: newUsers,
  };
}

function newMessage(room, action) {
  const { message } = action;
  const { messageID } = message;

  if (room.userID === message.userID) { // ignore our message
    return room;
  }

  const finalMessage = {
    ...message,
    attachments: [], // TODO may by get it from server??
    status: 'confirmed',
  };

  const {list: newMessageChunks, path} =
    ChunkList.append(room.messageChunks, finalMessage);

  const newMessagePaths = {
    ...room.messagePaths,
    [messageID]: path,
  };

  return {
    ...room,
    // TODO: insert at correct time, not last in list.
    messageChunks: newMessageChunks,
    messagePaths: newMessagePaths,
  };
}

function newAttachment(room, action) {
  const { messageID, meta, index, url } = action;
  const path = room.messagePaths[messageID];
  const message = ChunkList.get(room.messageChunks, path);

  if (!message) {
    // TODO handle situation;
    console.log('newAttachment could not find the messageID: `${messageID}`');
  }

  const finalMessage = {
    ...message,
    attachments: [
      ...message.attachments,
      { meta, index, url },
    ],
  };

  const newMessageChunks =
    ChunkList.replace(room.messageChunks, path, finalMessage);

  return {
    ...room,
    messageChunks: newMessageChunks,
  };
}

function sentMessage(room, action) {
  const { text, time, pendingID } = action;
  const { userID } = room;
  const finalMessage = {
    userID,
    messageID: pendingID,
    text,
    time,
    attachments: [],
    status: 'sent',
  };

  const {list: newMessageChunks, path} =
    ChunkList.append(room.messageChunks, finalMessage);

  const newMessagePaths = {
    ...room.messagePaths,
    [pendingID]: path,
  };

  return {
    ...room,
    // TODO: insert at correct time, not last in list.
    messageChunks: newMessageChunks,
    messagePaths: newMessagePaths,
  };
}

function confirmSentMessage(room, action) {
  const { pendingID, messageID, text } = action;

  const path = room.messagePaths[pendingID];
  const message = ChunkList.get(room.messageChunks, path);

  // Important: we modify the messageID here!
  const finalMessage = {
    ...message,
    status: 'confirmed',
    text,
    messageID,
  };

  const newMessageChunks =
    ChunkList.replace(room.messageChunks, path, finalMessage);

  const newMessagePaths = (() => {
    const tmp = { ...room.messagePaths };
    tmp[messageID] = path;
    delete tmp[pendingID];
    return tmp;
  })();

  return {
    ...room,
    messageChunks: newMessageChunks,
    messagePaths: newMessagePaths,
  };
}

function rejectSentMessage(room, action) {
  const { pendingID } = action;

  const path = room.messagePaths[pendingID];
  const message = ChunkList.get(room.messageChunks, path);

  // Important: we modify the messageID here!
  const finalMessage = {
    ...message,
    status: 'rejected',
  };

  const newMessageChunks =
    ChunkList.replace(room.messageChunks, path, finalMessage);

  return {
    ...room,
    messageChunks: newMessageChunks,
  };
}

/*
  joinedRooms: HashMap('roomID', {
    userID: string,
    secret: string,
    roomName: string,
    roomUsers: HashMap('userID', {
      avatar: string,
      nick: string,
    }),
    messageChunks: ChunkList({
      userID: string,
      messageID: string,
      text: string,
      time: number,
      attachments: [Attachment],
      status: 'sent' | 'confirmed' | 'rejected',
    })],
    messagePaths: HashMap('messageID', ChunkList.Path),
  });
*/
function joinedRooms(state = {}, action) {
  function insideRoom(roomID, reducer) {
    const room = state[roomID];
    if (!room) {
      console.log(`rooms ${action.type}: unexpected roomID "${roomID}"`);
      return state;
    }
    return {
      ...state,
      [roomID]: reducer(room, action),
    };
  }

  switch (action.type) {
    case actions.JOIN_USER:
      return insideRoom(action.roomID, joinUser);
    case actions.LEAVE_USER:
      return insideRoom(action.roomID, leaveUser);
    case actions.NEW_MESSAGE:
      return insideRoom(action.roomID, newMessage);
    case actions.NEW_ATTACHMENT:
      return insideRoom(action.roomID, newAttachment);
    case actions.SENT_MESSAGE:
      return insideRoom(action.roomID, sentMessage);
    case actions.CONFIRM_SENT_MESSAGE:
      return insideRoom(action.roomID, confirmSentMessage);
    case actions.REJECT_SENT_MESSAGE: {
      return insideRoom(action.roomID, rejectSentMessage);
    }
    case actions.LEAVE_ROOM: {
      const { roomID } = action;
      const newState = Object.assign({}, state);
      delete newState[roomID];
      return newState;
    }
    case actions.CONFIRM_JOIN_ROOM: {
      const { room, identity } = action;
      const { roomID } = room;
      const { userID, secret } = identity;
      const roomName = room.name;
      const roomUsers = room.users
        .reduce( (result, {userID: key, avatar, nick} ) => {
          return {
            ...result,
            [key]: {
              avatar,
              nick,
            },
          };
        }, {});

      const messages = action.room.messages.map(
        ({userID: thatUserID, messageID, text, time}) => ({
          messageID,
          userID: thatUserID,
          text,
          time,
          status: 'confirmed',
          attachments: [],
        })
      );

      const {list: messageChunks, paths} = ChunkList.create(messages);

      const messagePaths = {};
      paths.forEach(({element, path}) => {
        messagePaths[element.messageID] = path;
      });

      return {
        ...state,
        [roomID]: {
          userID,
          secret,
          roomName,
          roomUsers,
          messagePaths,
          messageChunks,
        },
      };
    }
    case actions.REJECT_JOIN_ROOM: {
      console.log(`Join room rejected: ${action.description}`);
      // TODO: show the error to user instead
      return state;
    }

    default: return state;
  }
}

const initialUi = {
  navigationCollapsed: false,
  previewCollapsed: false,
  searchInputText: '',
  roomInputText: '',
  searchResults: null,
};

/*
   ui: {
     navigationCollapsed: boolean,
     previewCollapsed: boolean,
     searchInputText: string,
     roomInputText: string,
     searchResults: null || [{
       roomID: string,
       name: string,
       users: number,
       rating: number,
     }],
   }
*/
function ui(state = initialUi, action) {
  switch (action.type) {
    case actions.CREATE_ROOM_FAILED: {
      // TODO handle it here.
      console.log('CREATE_ROOM_FAILED', action.description);
      return state;
    }
    case actions.SEARCH_RESULTS_FAILED: {
      // TODO indicate the failure to the user?
      return {
        ...state,
        searchResults: null,
      };
    }
    case actions.SEARCH_RESULTS_UPDATE: {
      return {
        ...state,
        searchResults: action.results,
      };
    }
    case actions.SEARCH_INPUT_CHANGE: {
      return {
        ...state,
        searchInputText: action.text,
      };
    }
    case actions.TOGGLE_PREVIEW: {
      return {
        ...state,
        previewCollapsed: !state.previewCollapsed,
      };
    }
    case actions.ROOM_INPUT_CHANGE: {
      return {
        ...state,
        roomInputText: action.text,
      };
    }
    case actions.TOGGLE_NAVIGATION: {
      return {
        ...state,
        navigationCollapsed: !state.navigationCollapsed,
      };
    }
    default: return state;
  }
}

/*
  joiningRooms: HashMap('roomID', bool)
*/
function joiningRooms(state = {}, action) {
  switch (action.type) {
    case actions.JOINING_ROOM: {
      return {
        ...state,
        [action.roomID]: true,
      };
    }
    case actions.CONFIRM_JOIN_ROOM: {
      const newState = Object.assign(state);
      delete newState[action.room.roomID];
      return newState;
    }
    case actions.REJECT_JOIN_ROOM: {
      const newState = Object.assign(state);
      delete newState[action.roomID];
      return newState;
    }
    default: return state;
  }
}

export default combineReducers({
  joinedRooms,
  joiningRooms,
  topRooms,
  ui,
  router: routerStateReducer,
});

