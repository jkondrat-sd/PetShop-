import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index'; // hoặc đường dẫn tới reducers/index.js

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
