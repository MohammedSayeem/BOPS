import React, { useRef, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { UserType } from '../../graphql/types';
import './SignInAndSignUpPage.scss';
import {
  userSignInFail,
  userSignInSuccess,
} from '../../redux/Actions/userActions';
import { createAlert } from '../../redux/Actions/AlertActions';
import { useHistory } from 'react-router-dom';

interface SignInVars {
  email: string;
  password: string;
}
interface SignUpVars extends SignInVars {
  mobile: string;
  fullname: string;
}
interface AuthType {
  signin: {
    token: string;
    user: UserType;
  };
}

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        _id
        email
        mobile
        fullname
        role
        shop {
          _id
        }
      }
    }
  }
`;
const SIGN_UP = gql`
  mutation SignUp(
    $fullname: String!
    $email: String!
    $mobile: String!
    $password: String!
  ) {
    signup(
      fullname: $fullname
      email: $email
      password: $password
      mobile: $mobile
    ) {
      token
      user {
        email
        mobile
        _id
        fullname
        role
      }
    }
  }
`;

const SignInAndSignUpPage: React.FC = () => {
  // hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [signInCredentials, setSignInCredentials] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });

  const [signUpCredentials, setSignUpCredentials] = useState<{
    email: string;
    password: string;
    confirmpassword: string;
    mobile: string;
    fullname: string;
  }>({
    email: '',
    password: '',
    confirmpassword: '',
    fullname: '',
    mobile: '',
  });

  const [signIn, { loading }] = useMutation<AuthType, SignInVars>(SIGN_IN);
  const [signUp, { loading: signuploading }] =
    useMutation<
      {
        signup: {
          token: string;
          user: UserType;
        };
      },
      SignUpVars
    >(SIGN_UP);
  // Handle SignIn Submit
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createAlert('Please Wait While We Sign You In', 'success'));
    const { password, email } = signInCredentials;
    signIn({
      variables: {
        email,
        password,
      },
    })
      .then((data) => {
        if (data.data?.signin.user) {
          dispatch(createAlert('Signed In Successfully', 'success'));
          history.goBack();
          dispatch(
            userSignInSuccess(data.data.signin.user, data.data?.signin.token)
          );
        }
        setSignInCredentials({
          email: '',
          password: '',
        });
        document.cookie = `token=${data.data?.signin.token}`;
      })
      .catch((err) => {
        dispatch(createAlert(err.message, 'error'));
        dispatch(userSignInFail(err.message));
      });
  };
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, fullname, mobile, password, confirmpassword } =
      signUpCredentials;
    if (confirmpassword !== password) {
      return alert('Password Doesnot Match');
    }
    dispatch(createAlert('Please Wait While We Sign You Up', 'success'));

    signUp({
      variables: {
        email,
        fullname,
        mobile,
        password,
      },
    })
      .then((data) => {
        if (data.data?.signup.user) {
          dispatch(createAlert('Signed Up Successfully', 'success'));
          history.goBack();
          dispatch(
            userSignInSuccess(data.data.signup.user, data.data?.signup.token)
          );
        }
        setSignUpCredentials({
          email: '',
          password: '',
          confirmpassword: '',
          fullname: '',
          mobile: '',
        });

        document.cookie = `token=${data.data?.signup.token}`;
      })
      .catch((err) => {
        dispatch(createAlert(err.message, 'error'));
        dispatch(userSignInFail(err.message));
      });
  };

  // Handle Input Change

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInCredentials({
      ...signInCredentials,
      [name]: value,
    });
  };
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpCredentials({
      ...signUpCredentials,
      [name]: value,
    });
  };

  const { password: loginpassword, email: loginemail } = signInCredentials;
  const { password, email, confirmpassword, fullname, mobile } =
    signUpCredentials;

  return (
    <div className='container' ref={containerRef}>
      <div className='forms-container'>
        <div className='signin-signup'>
          <form onSubmit={handleSignIn} className='sign-in-form'>
            <h2 className='title'>Sign in</h2>
            <div className='input-field'>
              <i className='fas fa-envelope'></i>
              <input
                type='email'
                placeholder='Email'
                name='email'
                value={loginemail}
                onChange={handleSignInChange}
              />
            </div>
            <div className='input-field'>
              <i className='fas fa-lock'></i>
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={loginpassword}
                onChange={handleSignInChange}
              />
            </div>
            <input className='btn solid' type='submit' value='Login' />
          </form>
          <form onSubmit={handleSignUp} className='sign-up-form'>
            <h2 className='title'>Sign up</h2>
            <div className='input-field'>
              <i className='fas fa-user'></i>
              <input
                type='text'
                placeholder='Full Name'
                name='fullname'
                required
                value={fullname}
                onChange={handleSignUpChange}
              />
            </div>
            <div className='input-field'>
              <i className='fas fa-phone'></i>
              <input
                required
                type='string'
                placeholder='Mobile Number'
                name='mobile'
                pattern='^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$'
                title='Enter A valid Indian Mobile Number'
                minLength={10}
                value={mobile}
                onChange={handleSignUpChange}
              />
            </div>
            <div className='input-field'>
              <i className='fas fa-envelope'></i>
              <input
                type='email'
                placeholder='Email'
                name='email'
                minLength={8}
                required
                value={email}
                onChange={handleSignUpChange}
              />
            </div>
            <div className='input-field'>
              <i className='fas fa-lock'></i>
              <input
                type='password'
                placeholder='Password'
                name='password'
                minLength={8}
                required
                value={password}
                onChange={handleSignUpChange}
              />
            </div>

            <div className='input-field'>
              <i className='fas fa-lock'></i>
              <input
                required
                type='password'
                placeholder='Confirm Password'
                name='confirmpassword'
                value={confirmpassword}
                onChange={handleSignUpChange}
              />
            </div>
            <input type='submit' className='btn' value='Sign up' />
          </form>
        </div>
      </div>
      <div className='panels-container'>
        <div className='panel left-panel'>
          <div className='content'>
            <h3>New here ?</h3>
            <button
              className='btn transparent'
              id='sign-up-btn'
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.classList.add('sign-up-mode');
                }
              }}
            >
              Sign up
            </button>
          </div>
        </div>
        <div className='panel right-panel'>
          <div className='content'>
            <h3>Already A Member ?</h3>
            <button
              className='btn transparent'
              id='sign-in-btn'
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.classList.remove('sign-up-mode');
                }
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInAndSignUpPage;
