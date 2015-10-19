import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';

import all from './reducers';
import createStorePlus from './store';
import rootFromStore from './root';

const START_DELAY = 2000;
const DISPATCH_DELAY = 1000;

// TODO
const profileState = undefined;
const profileActions = [];

const store = createStorePlus(all, profileState);
const root = rootFromStore(store);
const rootElement = document.getElementById('content');

ReactDOM.render(root, rootElement);

const delay = ms => new Promise((resolve, reject) => { setTimeout(resolve, ms); });

delay(START_DELAY).then(() => {
  Perf.start();
  profileActions.forEach(a => store.dispatch(a));
  return delay(DISPATCH_DELAY);
}).then(() => {
  Perf.stop();
  Perf.printWasted();
});
