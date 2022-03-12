import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';

import './NewUserForm.scss';

import CustomInput from '../CustomInput/CustomInput';
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser(
    $fullname: String
    $email: String
    $mobile: String
    $role: String
    $password: String
  ) {
    createUser(
      fullname: $fullname
      mobile: $mobile
      email: $email
      role: $role
      password: $password
    ) {
      _id
    }
  }
`;

const NewUserForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    fullname: '',
    email: '',
    mobile: '',
    password: '',
  });
  const roleRef = useRef<HTMLSelectElement | null>(null);
  const [createUser] = useMutation(CREATE_USER);
  const { email, fullname, mobile, password } = userDetails;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let role;
    if (roleRef.current) role = roleRef.current.selectedOptions[0].value;
    createUser({
      variables: {
        ...userDetails,
        role,
      },
    }).then(() => {
      setUserDetails({
        fullname: '',
        email: '',
        mobile: '',
        password: '',
      });
    });
  };
  return (
    <div className='custom-form-container'>
      <form id='new-user-form' className='custom-form' onSubmit={handleSubmit}>
        <CustomInput
          name='fullname'
          id='fullname'
          label='Full Name'
          value={fullname}
          onChange={handleChange}
        />
        <CustomInput
          name='email'
          id='email'
          label='Email'
          value={email}
          onChange={handleChange}
        />
        <CustomInput
          name='mobile'
          id='mobile'
          label='Mobile'
          value={mobile}
          onChange={handleChange}
        />
        <CustomInput
          name='password'
          id='password'
          label='Password'
          type='password'
          value={password}
          onChange={handleChange}
        />
        <div id='select-container'>
          <label htmlFor='role'>User Role</label>
          <select name='role' id='role' ref={roleRef}>
            <option value='admin'>Admin</option>
            <option value='shopOwner'>Shop Owner</option>
            <option value='user'>Normal User</option>
          </select>
        </div>
        <input type='submit' value='Add User'></input>
      </form>
    </div>
  );
};

export default NewUserForm;
