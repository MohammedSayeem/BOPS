import React from 'react';

import './Spinner.scss';

const Spinner: React.FC = () => {
  return (
    <div className='spinner-overlay'>
      <div className='spinner'>
        <div className='circle circle-1'></div>
        <div className='circle circle-2'></div>
        <div className='circle circle-3'></div>
      </div>
    </div>
  );
};

export default Spinner;
