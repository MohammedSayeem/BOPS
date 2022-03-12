import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { ReactComponent } from '../../cart.svg';

import { createAlert } from '../../redux/Actions/AlertActions';
import { userSignOut } from '../../redux/Actions/userActions';
import { RootState } from '../../redux/store';
import {
  defaultDialogValues,
  ConfirmDialog,
  ModalProps,
} from '../ConfirmDialog/ConfirmDialog';
import { ReactComponent as Logo } from '../../assets/logo.svg';
// import { ReactComponent as Logo } from '../../assets/BOPS.svg';
// import { ReactComponent as Logo } from '../../assets/bopslogo_2.svg';

import './Header.scss';

const Header: React.FC = () => {
  const history = useHistory();
  const [modalProps, setModalProps] = useState<ModalProps>(defaultDialogValues);
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state: RootState) => {
    return state;
  });

  return (
    <header className='header'>
      <div className='logo-container' onClick={() => history.push('/')}>
        <Logo style={{ minHeight: '100px' }} />
      </div>
      <div className='nav-items'>
        <div
          className='cart-container nav-item'
          onClick={() => history.push('/cart')}
        >
          <span id='cart-count'>{cart.cartItems.length}</span>
          <ReactComponent className='cart-icon' />
        </div>
        {user.currentUser ? (
          <React.Fragment>
            <button
              className='nav-btn nav-item'
              onClick={() => {
                user.currentUser?.role === 'admin'
                  ? history.push('/admin')
                  : history.push('/me');
              }}
            >
              My Account
            </button>
            <button
              className='nav-btn nav-item'
              onClick={() => {
                setModalProps({
                  header: '',
                  main: 'Do You Want To Sign Out from the app',
                  onConfirm: () => {
                    document.cookie = 'token=;';
                    dispatch(userSignOut());
                    dispatch(createAlert('Signed Out Successfully', 'success'));
                    setModalProps(defaultDialogValues);
                    history.push('/');
                  },
                  onExit: () => {
                    setModalProps(defaultDialogValues);
                  },
                  show: true,
                });
              }}
            >
              Sign Out
            </button>
          </React.Fragment>
        ) : (
          <button
            onClick={() => history.push('/signin')}
            className='nav-btn nav-item'
          >
            Sign In
          </button>
        )}
        <ConfirmDialog {...modalProps} />
      </div>
    </header>
  );
};

export default Header;
