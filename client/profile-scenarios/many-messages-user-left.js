import _ from 'lodash';
import { baseActions, roomID } from './base';
import { newMessage, joinUser, leaveUser } from '../actions';

const N = 3000;

const userA = {
  userID: 'fake-userID-01',
  nick: 'Heartless Bastard',
  avatar: '',
  roomID,
};

const userB = {
  userID: 'fake-userID-02',
  nick: 'Big Smoke',
  avatar: '',
  roomID,
};

const manyMessages = _.range(N).map(i =>
  newMessage({
    roomID,
    userID: userB.userID,
    messageID: `fake-messageID-${i}`,
    text: `# ${i}.`,
    time: 1000000000000 + i,
  })
);

export const delay1 = 5000;
export const delay2 = 1000;

export const state = undefined;

export const preActions = ({history}) => [
  ...baseActions(history),
  joinUser(userA),
  joinUser(userB),
  ...manyMessages,
];

export const actions = [
  leaveUser({userID: userA.userID, roomID}),
];
