import ReactDOM from 'react-dom';

import { readState } from './storage';
import createStorePlus from './store';
import all from './reducers';
import { updateTopRooms, newMessage, newAttachment,
         joinUser, leaveUser } from 'actions';
import { restoreState } from './smartActions';
import * as transport from './transport';
import rootFromStore from './root';

const store = createStorePlus(all);
const lastState = readState();
const root = rootFromStore(store);
const rootElement = document.getElementById('content');

transport.onMessage(data =>
    store.dispatch(newMessage(data)));

transport.onAttachment(data =>
    store.dispatch(newAttachment(data)));

transport.onJoinUser(data =>
    store.dispatch(joinUser(data)));
transport.onLeaveUser(data =>
    store.dispatch(leaveUser(data)));

transport.onTopRooms(data =>
    store.dispatch(updateTopRooms(data.rooms)));

ReactDOM.render(root, rootElement);

// dispatch after render. otherwise the router doesn't initialize correctly
store.dispatch(restoreState(lastState));

