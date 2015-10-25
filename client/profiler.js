import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';

import all from './reducers';
import createStoreWithOptions from './store';
import rootFromStore from './root';

console.log('profiler: loading "' + PROFILE_SCENARIO + '".');

const { state, actions, preActions, delay1, delay2 } =
  require('./profile-scenarios/' + PROFILE_SCENARIO);

const DEFAULT_DELAY1 = 1000;
const DEFAULT_DELAY2 = 1000;

const finalDelay1 = delay1 || DEFAULT_DELAY1;
const finalDelay2 = delay2 || DEFAULT_DELAY2;

const store = createStoreWithOptions({profiler: true})(all, state);
const root = rootFromStore(store);
const rootElement = document.getElementById('content');

const options = {history: store.history};
const finalPreActions = typeof preActions === 'function' ?
  preActions(options) : preActions;
const finalActions = typeof actions === 'function' ?
  actions(options) : actions;

const delay = ms => new Promise(resolve => { setTimeout(resolve, ms); });
const dispatchAll = as => as.forEach(a => store.dispatch({...a, profiler: true}));

if (finalPreActions) dispatchAll(finalPreActions);
ReactDOM.render(root, rootElement);
console.log(`profiler will wait for ${finalDelay1} ms before starting.`);

delay(finalDelay1).then(() => {
  console.log('profiler has started.');
  Perf.start();
  console.time('666-dispatch');
  dispatchAll(finalActions);
  console.timeEnd('666-dispatch');
  return delay(finalDelay2);
}).then(() => {
  console.log('profiler has finished.');
  Perf.stop();
  console.log('Inclusive:');
  Perf.printInclusive();
  console.log('Exclusive:');
  Perf.printExclusive();
  console.log('Wasted:');
  Perf.printWasted();
  console.log('DOM:');
  Perf.printDOM();
});
