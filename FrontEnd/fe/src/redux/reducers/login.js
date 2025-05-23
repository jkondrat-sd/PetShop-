import { getCookie } from "~/helpers/cookie";

const initialState = {
  isLoggedIn: false,
  userData: null
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHECK_LOGIN':
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        userData: action.payload.userData
      };
    default:
      return state;
  }
}

