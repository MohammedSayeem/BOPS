import { gql, useMutation } from '@apollo/client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  ModalProps,
  defaultDialogValues,
  ConfirmDialog,
} from '../../components/ConfirmDialog/ConfirmDialog';
import { FETCH_ORDERS } from '../../graphql/queries';
import { ProductType } from '../../graphql/types';
import { createAlert } from '../../redux/Actions/AlertActions';
import { clearCartItems } from '../../redux/Actions/CartActions';
import { RootState } from '../../redux/store';

import './CheckoutPage.scss';
interface CartItemType extends ProductType {
  quantity: number;
}

const CREATE_ORDER = gql`
  mutation CREATE_ORDER(
    $shop: String!
    $user: String!
    $amount: Float!
    $items: [orderitems]!
    $razorpayobj: razorpayobj
  ) {
    createOrder(
      shop: $shop
      user: $user
      amount: $amount
      items: $items
      razorpayobj: $razorpayobj
    ) {
      _id
    }
  }
`;

const CheckoutPage: React.FC = () => {
  const { cart, user } = useSelector((state: RootState) => state);
  const [modalProps, SetModalProps] = useState<ModalProps>(defaultDialogValues);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const inputRef = useRef<HTMLInputElement>(null);
  const [otype, setotype] = useState('pickup');
  const [ptype, setptype] = useState('online');
  const history = useHistory();
  const [createOrder] = useMutation(CREATE_ORDER);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const { currentUser } = user;
  let cartTotal = 0;
  if (cartItems.length > 0) {
    cartTotal = cartItems.reduce(
      (total: number, cartitem: CartItemType) =>
        total + cartitem.price * cartitem.quantity,
      0
    );
  }
  const options = {
    key: 'rzp_test_zcbM30iDFj7DbM',
    amount: cartTotal * 100, //  = INR 1
    name: 'BOPS',
    description: 'Buy Online PickUp At Store',
    image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
    handler: async function (response: any) {
      try {
        if (response) {
          handleOrder(response);
          SetModalProps(defaultDialogValues);
          dispatch(clearCartItems());
          history.push('/');
          dispatch(createAlert('Order Placed Successfully', 'success'));
        }
      } catch (err) {
        console.log(err);
      }
    },
    prefill: {
      name: currentUser?.fullname,
      contact: currentUser?.mobile,
      email: currentUser?.email,
    },
    order_id: '',
    notes: {
      address: 'some address',
    },
    theme: {
      color: '#1d212d',
      hide_topbar: false,
    },
    readonly: {
      name: true,
      contact: true,
      email: true,
    },
  };
  const openPayModal = async () => {
    dispatch(createAlert('Please Wait While we open Payment page', 'success'));
    const { data } = await axios.post(
      '/payments',
      {
        amount: cartTotal * 100,
        currency: 'INR',
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    options.order_id = data.order.id;
    if (window.Razorpay) {
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  const deliveryCharge = otype === 'delivery' ? 50 : 0;
  const handleCheckout = () => {
    if (ptype === 'online') {
      SetModalProps({
        header: 'Do you want to proceed?',
        onConfirm: () => {
          openPayModal();
          SetModalProps(defaultDialogValues);
        },
        onExit: () => SetModalProps(defaultDialogValues),
        main: 'This Will open a payment window',
        show: true,
      });
    } else {
      SetModalProps({
        header: 'Do you want to proceed with your order',
        main: 'You have Chosen payment option as Cash On Delivery',
        onExit: () => SetModalProps(defaultDialogValues),
        show: true,
        onConfirm: () => {
          handleOrder();
          dispatch(createAlert('Order Placed Successfully', 'success'));

          SetModalProps(defaultDialogValues);

          dispatch(clearCartItems());
          history.push('/');
        },
      });
    }
  };
  const handleOrder = (response?: any) => {
    try {
      createOrder({
        variables: {
          user: currentUser?._id,
          shop: cart.cartItems[0].shop,
          items: cartItems.reduce((initialValue, cartItem) => {
            initialValue.push({
              product: cartItem._id,
              quantity: cartItem.quantity,
            });
            return initialValue;
          }, [] as any),
          amount: cartTotal,
          razorpayobj: response ? response : undefined,
        },
        context: {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
        refetchQueries: [
          {
            query: FETCH_ORDERS,
          },
        ],
      })
        .then((data) => {
          dispatch(clearCartItems());
        })
        .catch((err) => console.log('hi', err));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ConfirmDialog {...modalProps} />
      <div className='checkout-page'>
        <div className='cart-items'>
          <h2>Order Items</h2>
          <ul>
            {cartItems.map((item) => (
              <li>
                <img src={item.image} alt='' />
                <span>
                  {item.name} x {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='checkout-form-container'>
          <form className='checkout-form'>
            <h3>Order Type</h3>
            <div className='input-container'>
              <label>
                <input
                  type='radio'
                  name='otype'
                  defaultChecked
                  value='pickup'
                  onChange={(e) => setotype(e.target.value)}
                  checked={otype === 'pickup'}
                />
                <span>In Store PickUp</span>
              </label>
              <label>
                <input
                  type='radio'
                  name='otype'
                  ref={inputRef}
                  value='delivery'
                  onChange={(e) => setotype(e.target.value)}
                  checked={otype === 'delivery'}
                />
                <span>Home Delivery</span>
              </label>
            </div>
            <h3>Payment Type</h3>
            <div className='input-container'>
              <label>
                <input
                  onChange={(e) => setptype(e.target.value)}
                  type='radio'
                  name='ptype'
                  defaultChecked
                  value='online'
                />
                <span>Online Payment</span>
              </label>
              <label>
                <input
                  type='radio'
                  name='ptype'
                  value='cod'
                  onChange={(e) => setptype(e.target.value)}
                />
                <span>Cash On Delivery</span>
              </label>
            </div>
            {inputRef.current?.checked && (
              <>
                <label htmlFor='address'>Address</label>
                <textarea
                  required
                  minLength={50}
                  name='address'
                  id='address'
                  rows={6}
                />
              </>
            )}
          </form>
        </div>
        <div className='shipping'>
          {/* <button className='back-btn'>Back to Cart</button> */}
          <div className='details'>
            <span>
              Sub Total: <em>{cartTotal}</em>
            </span>
            <span>
              Delivery Charge: <em>{deliveryCharge}</em>
            </span>
            <span>
              Total: <em>{cartTotal + deliveryCharge}</em>
            </span>
            <button onClick={handleCheckout}>
              {ptype === 'cod' ? 'Place Order' : 'Proceed To Payment'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CheckoutPage;
