import React from 'react';
import { useHistory } from 'react-router-dom';

import './ErrorPage.scss';

const ErrorPage: React.FC<{ message: string }> = ({ message }) => {
  const history = useHistory();
  return (
    <div className='o-404'>
      <h1 className='a-title'>404</h1>
      <p className='a-message'>{message}</p>
      <div className='o-cat'>
        <div className='m-ears'>
          <div className='m-ear -right'></div>
          <div className='m-ear -left'></div>
        </div>
        <div className='m-face'>
          <div className='m-eyes'>
            <div className='m-eye -left'>
              <div className='a-eyePupil'></div>
            </div>
            <div className='m-eye -right'>
              <div className='a-eyePupil'></div>
            </div>
          </div>
          <div className='m-nose'></div>
        </div>
      </div>
      <button className='homebtn' onClick={() => history.push('/')}>
        Back To HomePage
      </button>
    </div>
  );
};

export default ErrorPage;
