import { UserType } from '../../graphql/types';
import { UserActionTypes } from '../ActionTypes/UserActionTypes';

export const userSignInSuccess = (user: UserType, token: string) => ({
  type: UserActionTypes.USER_SIGN_IN_SUCCESS,
  payload: { user, token },
});
export const userSignInFail = (error: string) => ({
  type: UserActionTypes.USER_SIGN_IN_FAIL,
  payload: error,
});
export const userSignOut = () => ({
  type: UserActionTypes.USER_SIGN_OUT,
});
