import React, { useEffect } from 'react';
import {
  Switch,
  Redirect,
  Route,
  // useHistory,
  useLocation,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';

import { RootState } from './redux/store';
import { UserType } from './graphql/types';
import { store } from './redux/store';

import './App.scss';

import { ReactComponent as Wave } from './assets/waveAsset 4.svg';
import { ReactComponent as Wave1 } from './assets/waveAsset 1.svg';
import SignInAndSignUpPage from './pages/SignInAndSignUp/SignInAndSignUpPage';
import Header from './components/Header/Header';
import ProductsPage from './pages/Products/ProductsPage';
import OrdersTable from './components/OrdersTable/OrdersTable';
import ProductsForm from './components/ProductsForm/ProductsForm';
import CartPage from './pages/Cart/CartPage';
import AdminPage from './pages/Admin/AdminPage';
import AccountPage from './pages/Account/AccountPage';
import Dashboard from './pages/Dashboard/Dashboard';
import { Alert } from './components/Alert/Alert';

import { userSignInSuccess } from './redux/Actions/userActions';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ErrorPage from './pages/Error/ErrorPage';
// import Spinner from './components/Spinner/Spinner';

const USER_QUERY = gql`
  query getSignedInUser($token: String) {
    user(token: $token) {
      _id
      fullname
      email
      mobile
      role
      shop {
        _id
      }
    }
  }
`;
interface queryVars {
  token: string;
}
interface AuthType {
  user: UserType;
}

const App: React.FC = () => {
  const {
    user: { currentUser },
    cart: { cartItems },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.alert);
  const { data } = useQuery<AuthType, queryVars>(USER_QUERY, {
    variables: {
      token: document.cookie.split('=')[1],
    },
  });
  useEffect(() => {
    // function setUser() {
    if (data) {
      dispatch(userSignInSuccess(data.user, document.cookie.split('=')[1]));
    }
    // }
    return function persistState() {
      store.subscribe(() =>
        localStorage.setItem(
          'reduxState',
          JSON.stringify({
            ...store.getState(),
            user: {
              currentUser: null,
              error: '',
              token: '',
            },
          })
        )
      );
    };
  }, [data]);
  // const history = useHistory();
  const location = useLocation();
  return (
    <div className='App'>
      {location.pathname !== '/signin' && <Header />}
      {location.pathname === '/' && <Wave />}
      {message.length > 0 && <Alert message={message} type={type} />}
      <Switch>
        <Route exact path='/' render={() => <Dashboard />} />

        <Route exact path='/cart' component={CartPage} />
        <Route
          exact
          path='/me'
          render={() =>
            !currentUser ? <Redirect to='/signin' /> : <AccountPage />
          }
        />
        <Route
          exact
          path='/admin'
          render={() =>
            currentUser?.role !== 'admin' ? (
              <Redirect to='/me' />
            ) : (
              <AdminPage />
            )
          }
        />
        <Route
          exact
          path='/checkout'
          render={() =>
            cartItems.length === 0 || !currentUser ? (
              <Redirect to='/cart' />
            ) : (
              <CheckoutPage />
            )
          }
        />
        <Route exact path='/add-product' component={ProductsForm} />
        <Route
          exact
          path='/signin'
          render={() =>
            currentUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
          }
        />
        <Route exact path='/shop/:shopId' component={ProductsPage} />
        <Route exact path='/orders' component={OrdersTable} />
        <Route path='/*' component={ErrorPage} />
      </Switch>
      {location.pathname === '/' && <Wave1 style={{ marginBottom: '-15px' }} />}
    </div>
  );
};

export default App;
