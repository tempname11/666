import _ from 'lodash';
import { baseActions, roomID } from './base';
import { newMessage } from '../actions';

const N = 100;
const manyMessages = _.range(N).map(i =>
  newMessage({
    roomID,
    userID: 'fake-userID-01',
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
  ...manyMessages,
];

const makeHorse = i =>
  newMessage({
    roomID,
    userID: 'fake-userID-02',
    messageID: `fake-messageID-Horse${i}`,
    text: `Horse #${i}: https://twitter.com/horse_js/status/658139754542710784`,
    time: 1000007000000 + i,
  });

export const actions = [
  makeHorse(0),
];
