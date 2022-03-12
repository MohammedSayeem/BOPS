import { UserType } from '../../graphql/types';
import { UserActionTypes } from '../ActionTypes/UserActionTypes';
const INITIAL_STATE: StateType = {
  currentUser: null,
  error: '',
  token: '',
};
interface StateType {
  currentUser: UserType | null;
  error: string;
  token: string;
}
interface userSignInStartAction {
  type: UserActionTypes.USER_SIGN_IN_START;
  payload: {
    email: string;
    password: string;
  };
}
interface userSignInFailAction {
  type: UserActionTypes.USER_SIGN_IN_FAIL;
  payload: string;
}

interface userSignInSuccessAction {
  type: UserActionTypes.USER_SIGN_IN_SUCCESS;
  payload: {
    user: UserType;
    token: string;
  };
}
interface userSignOutAction {
  type: UserActionTypes.USER_SIGN_OUT;
}
type ActionType =
  | userSignInFailAction
  | userSignInSuccessAction
  | userSignInStartAction
  | userSignOutAction;
const reducer = (state: StateType = INITIAL_STATE, action: ActionType) => {
  switch (action.type) {
    case UserActionTypes.USER_SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token,
      };
    case UserActionTypes.USER_SIGN_IN_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UserActionTypes.USER_SIGN_OUT:
      return {
        ...state,
        currentUser: null,
      };

    default:
      return state;
  }
};

export default reducer;
