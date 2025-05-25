import { combineReducers } from "redux";

import loginReducer from "./login";
import alertReducer from "./alert";
import loadingReducer from "./loading";
import petReducer from "./petReducer";
import accessoryReducer from './accessoryReducer';

const allReducers = combineReducers({
  loginReducer,
  alertReducer,
  loadingReducer,
  pet: petReducer,
  accessory: accessoryReducer
});

export default allReducers;
