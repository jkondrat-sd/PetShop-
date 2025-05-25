import { combineReducers } from "redux";

import loginReducer from "./login";
import alertReducer from "./alert";
import loadingReducer from "./loading";
import petReducer from "./petReducer";
import accessoryReducer from './accessoryReducer';
import orderReducer from './orderReducer';
import userReducer from './userReducer';

const allReducers = combineReducers({
  loginReducer,
  alertReducer,
  loadingReducer,
  pet: petReducer,
  accessory: accessoryReducer,
  user: userReducer,
  order: orderReducer
});

export default allReducers;
