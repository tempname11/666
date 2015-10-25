import _ from 'lodash';
import { baseActions, roomID } from './base';
import { newMessage } from '../actions';

const N = 1000;
const manyMessages = _.range(N).map(i =>
  newMessage({
    roomID,
    userID: 'fake-userID-01',
    messageID: `fake-messageID-${i}`,
    text: `# ${i}.`,
    time: 1000000000000,
  })
);

export const delay1 = 3000;
export const delay2 = 1000;

export const state = undefined;

export const preActions = ({history}) => [
  ...baseActions(history),
  ...manyMessages,
];

export const actions = [
];
