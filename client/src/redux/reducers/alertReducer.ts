import { AlertActionTypes } from '../ActionTypes/AlertActionTypes';

const INITIAL_STATE = {
  message: '',
  type: 'success',
};
interface setAlertActionType {
  type: AlertActionTypes.SET_ALERT;
  payload: {
    message: string;
    type: string;
  };
}
interface removeAlertActionType {
  type: AlertActionTypes.REMOVE_ALERT;
}
type ActionType = setAlertActionType | removeAlertActionType;

const reducer = (state = INITIAL_STATE, action: ActionType) => {
  switch (action.type) {
    case AlertActionTypes.SET_ALERT:
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    case AlertActionTypes.REMOVE_ALERT:
      return {
        message: '',
        type: '',
      };
    default: {
      return state;
    }
  }
};
export default reducer;
