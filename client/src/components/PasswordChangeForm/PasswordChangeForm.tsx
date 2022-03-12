import React, { ChangeEvent, useState } from 'react';
import CustomInput from '../CustomInput/CustomInput';

const PasswordChangeForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    currentpassword: '',
    newpassword: '',
    confirmpassword: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };
  const { confirmpassword, currentpassword, newpassword } = userDetails;
  return (
    <div className='custom-form-container'>
      <form className='custom-form'>
        <CustomInput
          name='currentpassword'
          id='currentpassword'
          label='Current Password'
          type='password'
          required
          value={currentpassword}
          onChange={handleChange}
        />
        <CustomInput
          id='newpassword'
          name='newpassword'
          label='New Password'
          value={newpassword}
          onChange={handleChange}
          type='password'
          required
        />
        <CustomInput
          id='confirmpassword'
          name='confirmpassword'
          label='Confirm Password'
          value={confirmpassword}
          onChange={handleChange}
          type='password'
          required
        />
        <input type='submit' value='Update Password'></input>
      </form>
    </div>
  );
};
export default PasswordChangeForm;
