import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CartItem from '../../components/CartItem/CartItem';
import {
  ConfirmDialog,
  ModalProps,
  defaultDialogValues,
} from '../../components/ConfirmDialog/ConfirmDialog';
import { ProductType } from '../../graphql/types';
import { clearCartItems } from '../../redux/Actions/CartActions';
import { RootState } from '../../redux/store';

import './CartPage.scss';

interface CartItemType extends ProductType {
  quantity: number;
}

const CartPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const {
    cart,
    user: { currentUser },
  } = useSelector((state: RootState) => state);
  const [modalProps, SetModalProps] = useState<ModalProps>(defaultDialogValues);

  const { cartItems } = cart;
  let cartTotal = 0;
  if (cartItems.length > 0) {
    cartTotal = cartItems.reduce(
      (total: number, cartitem: CartItemType) =>
        total + cartitem.price * cartitem.quantity,
      0
    );
  }

  return (
    <div className='cart-page'>
      {cartItems.length === 0 ? (
        <h1 style={{ textAlign: 'center' }}>Cart Is Empty</h1>
      ) : (
        <>
          <h2 className='primary-heading' style={{ textAlign: 'center' }}>
            Cart Items
          </h2>
          <ul className='cart-items'>
            <li className='cart-header'>
              <span>Image</span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Remove</span>
              <span>Item Total</span>
            </li>
            {cartItems.map((item) => (
              <CartItem item={item} key={item._id} />
            ))}
          </ul>
          <div className='cart-footer'>
            <button
              onClick={() => {
                SetModalProps({
                  header: 'Do You Confirm?',
                  main: 'This will delete all of your cart items',
                  onConfirm: () => {
                    dispatch(clearCartItems());
                    SetModalProps(defaultDialogValues);
                  },
                  show: true,
                  onExit: () => {
                    SetModalProps(defaultDialogValues);
                  },
                });
              }}
            >
              Clear Cart
            </button>
            <div>
              Total Amount: <span>{cartTotal}</span>
            </div>
          </div>
          <div className='payment-btn-container'>
            <button
              id='razorpay-btn'
              onClick={() => {
                currentUser
                  ? SetModalProps({
                      header: 'Do you want to proceed?',
                      onConfirm: () => {
                        SetModalProps(defaultDialogValues);
                        history.push('/checkout');
                      },
                      onExit: () => SetModalProps(defaultDialogValues),
                      main: 'This Will open checkout page',
                      show: true,
                    })
                  : SetModalProps({
                      header: 'You Are not signed in',
                      onConfirm: () => {
                        SetModalProps(defaultDialogValues);
                        history.push('/signin');
                      },
                      onExit: () => SetModalProps(defaultDialogValues),
                      main: 'This Will take you to the sign in page',
                      show: true,
                    });
              }}
            >
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
      <ConfirmDialog {...modalProps} />
    </div>
  );
};

export default CartPage;
