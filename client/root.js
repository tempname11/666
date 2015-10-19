import 'scss/main.scss';
import 'babel-core/polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import { Route } from 'react-router';

import App from './components/App';
import RoomEntrance from './components/RoomEntrance';
import NotFound from './components/Splashes/NotFound';

export default store => (
  <Provider store={store}>
    <ReduxRouter>
      <Route path="/" component={App}>
        <Route path="/room/:roomID" component={RoomEntrance}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </ReduxRouter>
  </Provider>
);

