import { joiningRoom, confirmJoinRoom } from '../actions';
import { pushState, replaceState } from 'redux-router';

export const roomID = 'base';
export const userID = 'fake-userID-00';
const nick = 'Test Subject';
const avatar = '';

export const baseActions = history => [
  replaceState(history, '/'),
  joiningRoom(roomID),
  confirmJoinRoom({
    identity: {
      userID,
      avatar,
      nick,
      secret: 'fake-secret-00',
    },
    room: {
      messages: [],
      name: roomID,
      rating: 0,
      roomID,
      users: [{
        roomID,
        userID,
        avatar,
        nick,
      }],
    },
  }),
  pushState(history, `/room/${roomID}`),
];
