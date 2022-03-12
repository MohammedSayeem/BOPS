import React from 'react';

import './Alert.scss';

export interface AlertPropsType {
  // show: boolean;
  message: string;
  type: string;
}
export const defaultProps: AlertPropsType = {
  // show: false,
  message: '',
  type: 'success',
};

export const Alert: React.FC<AlertPropsType> = ({ message, type }) => {
  return (
    <div className='alert-container'>
      <p className={`alert-message ${type}`}>{message}</p>
    </div>
  );
};
