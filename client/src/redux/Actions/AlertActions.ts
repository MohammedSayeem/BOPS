import { AlertActionTypes } from '../ActionTypes/AlertActionTypes';

export const setAlert = (message: string, type: string) => ({
  type: AlertActionTypes.SET_ALERT,
  payload: {
    message,
    type,
  },
});
export const removeAlert = () => ({
  type: AlertActionTypes.REMOVE_ALERT,
});

export const createAlert = (message: string, type: string) => {
  return (dispatch: any) => {
    dispatch(setAlert(message, type));
    setTimeout(() => {
      dispatch(removeAlert());
    }, 2000);
  };
};
