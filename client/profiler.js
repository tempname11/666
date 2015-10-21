import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';

import all from './reducers';
import createStoreWithOptions from './store';
import rootFromStore from './root';

console.log('profiler: loading "' + PROFILE_SCENARIO + '".');
const { state, actions } = require('./profile-scenarios/' + PROFILE_SCENARIO);

const START_DELAY = 2000;
const DISPATCH_DELAY = 1000;

const store = createStoreWithOptions({profiler: true})(all, state);
const root = rootFromStore(store);
const rootElement = document.getElementById('content');

ReactDOM.render(root, rootElement);
console.log(`profiler will wait for ${START_DELAY} ms before starting.`);

const delay = ms => new Promise(resolve => { setTimeout(resolve, ms); });

delay(START_DELAY).then(() => {
  console.log('profiler has started.');
  Perf.start();
  console.time('666-dispatch');
  actions.forEach(a => store.dispatch({...a, profiler: true}));
  console.timeEnd('666-dispatch');
  return delay(DISPATCH_DELAY);
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
