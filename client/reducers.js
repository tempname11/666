import { combineReducers } from 'redux';
import * as actions from 'actions';
import { routerStateReducer } from 'redux-router';
import * as ChunkTree from '../common/ChunkTree';

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
  const userID = action.message.userID;
  const { messageID } = message;

  if (room.userID === userID) { // ignore our message
    return room;
  }

  const finalMessage = {
    ...message,
    attachments: [], // TODO may by get it from server??
    status: 'confirmed',
  };

  // TODO: insert at correct time, not last in list.
  const {tree: newMessageTree, path} =
    ChunkTree.append(room.messageTree, finalMessage);

  const newMessagePaths = {
    ...room.messagePaths,
    [messageID]: path,
  };

  return {
    ...room,
    messageTree: newMessageTree,
    messagePaths: newMessagePaths,
  };
}

function newAttachment(room, action) {
  const { messageID, meta, index, url } = action;
  const path = room.messagePaths[messageID];
  const message = ChunkTree.get(room.messageTree, path);
  if (!message) {
    // TODO handle situation;
    console.log('newAttachment could not find the messageID: `${messageID}`');
  }
  const { attachments } = message;

  const updatedMessage = {
    ...message,
    attachments: [
      ...attachments,
      { meta, index, url },
    ],
  };

  const newMessageTree = ChunkTree.replace(room.messageTree, path, updatedMessage);

  return {
    ...room,
    messageTree: newMessageTree,
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

  // TODO: insert at correct time, not last in list.
  const {tree: newMessageTree, path} =
    ChunkTree.append(room.messageTree, finalMessage);

  const newMessagePaths = {
    ...room.messagePaths,
    [pendingID]: path,
  };

  return {
    ...room,
    messageTree: newMessageTree,
    messagePaths: newMessagePaths,
  };
}

function confirmSentMessage(room, action) {
  const { pendingID, messageID, text } = action;

  const path = room.messagePaths[pendingID];
  const message = ChunkTree.get(room.messageTree, path);

  // Important: we have changed the messageID here.
  const updatedMessage = {
    ...message,
    status: 'confirmed',
    text,
    messageID,
  };

  const newMessageTree = ChunkTree.replace(room.messageTree, path, updatedMessage);

  const newMessagePaths = (() => {
    const t = {
      ...room.messagePaths,
      [messageID]: path,
    };
    delete t[pendingID];
    return t;
  })();

  return {
    ...room,
    messageTree: newMessageTree,
    messagePaths: newMessagePaths,
  };
}

function rejectSentMessage(room, action) {
  const { pendingID } = action;

  const path = room.messagePaths[pendingID];
  const message = ChunkTree.get(room.messageTree, path);

  const updatedMessage = {
    ...message,
    status: 'rejected',
  };

  const newMessageTree = ChunkTree.replace(room.messageTree, path, updatedMessage);

  return {
    ...room,
    messageTree: newMessageTree,
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
    messageTree: ChunkTree({
      userID: string,
      messageID: string,
      text: string,
      time: number,
      attachments: [Attachment],
      status: 'sent' | 'confirmed' | 'rejected',
    }),
    messagePaths: HashMap('messageID', ChunkTree.Path),
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
      const { roomID, messages, name: roomName } = action.room;
      const { userID, secret } = action.identity;

      const roomUsers = action.room.users.reduce(
        (result, {userID: key, avatar, nick}) => ({
          ...result,
          [key]: {
            avatar,
            nick,
          },
        }), {});

      const { tree: messageTree, paths: messagePaths } =
        messages.reduce(
          ({tree, paths}, {userID: thatUserID, messageID, text, time}) => {
            const message = {
              messageID,
              userID: thatUserID,
              text,
              time,
              status: 'confirmed',
              attachments: [],
            };
            const {tree: newTree, path} = ChunkTree.append(tree, message);
            const newPaths = { ...paths, [messageID]: path };
            return {tree: newTree, paths: newPaths};
          },
          {tree: ChunkTree.create(), paths: {}}
        );

      return {
        ...state,
        [roomID]: {
          userID,
          secret,
          roomName,
          roomUsers,
          messageTree,
          messagePaths,
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

