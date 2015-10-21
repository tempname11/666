import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';

import all from './reducers';
import createStoreWithOptions from './store';
import rootFromStore from './root';

console.log('profiler: loading "' + PROFILE_SCENARIO + '".');

const { state, actions, delay1, delay2 } =
  require('./profile-scenarios/' + PROFILE_SCENARIO);

const DEFAULT_DELAY1 = 1000;
const DEFAULT_DELAY2 = 1000;

const finalDelay1 = delay1 || DEFAULT_DELAY1;
const finalDelay2 = delay2 || DEFAULT_DELAY2;

const store = createStoreWithOptions({profiler: true})(all, state);
const root = rootFromStore(store);
const rootElement = document.getElementById('content');

ReactDOM.render(root, rootElement);
console.log(`profiler will wait for ${finalDelay1} ms before starting.`);

const delay = ms => new Promise(resolve => { setTimeout(resolve, ms); });

delay(finalDelay1).then(() => {
  console.log('profiler has started.');
  Perf.start();
  console.time('666-dispatch');
  actions.forEach(a => store.dispatch({...a, profiler: true}));
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
