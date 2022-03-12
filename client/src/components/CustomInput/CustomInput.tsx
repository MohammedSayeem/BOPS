import React, { InputHTMLAttributes } from 'react';

import './CustomInput.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const CustomInput: React.FC<InputProps> = ({ label, id, ...otherProps }) => {
  return (
    <div className='custom-input-container'>
      <input className='custom-input' id={id} {...otherProps} />
      <label
        className={`${
          typeof otherProps.value === 'string' && otherProps.value.length
            ? 'shrink'
            : ''
        } custom-input-label`}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomInput;
