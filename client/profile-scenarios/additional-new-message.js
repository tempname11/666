export { state } from './message-input-heavy';
import { newMessage } from '../actions';

export const delay1 = 1500;
export const delay2 = 1000;

export const actions = [
  newMessage({
    roomID: 'optimization',
    userID: 'fake-user-id',
    messageID: 'fake-message-id',
    text: 'Some arbitrary content.',
    time: 1445672182504,
  }),
];

