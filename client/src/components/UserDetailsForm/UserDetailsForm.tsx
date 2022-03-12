import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CustomInput from '../CustomInput/CustomInput';

const UserDetailsForm: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userDetails, setUserDetails] = useState({
    fullname: currentUser?.fullname,
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      fullname: e.target.value,
    });
  };
  const { fullname } = userDetails;
  return (
    <div className='custom-form-container'>
      <form className='custom-form'>
        <CustomInput
          name='fullname'
          id='fullname'
          label='Full Name'
          value={fullname}
          onChange={handleChange}
        />
        <CustomInput
          disabled
          id='email'
          label='Email'
          value={currentUser?.email}
        />
        <CustomInput
          disabled
          id='mobile'
          label='Mobile'
          value={currentUser?.mobile}
        />
        <input type='submit' value='Update Details'></input>
      </form>
    </div>
  );
};
export default UserDetailsForm;
