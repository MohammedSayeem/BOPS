import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductType } from '../../graphql/types';
import {
  addItemToCart,
  clearCartItems,
  removeItemFromCart,
} from '../../redux/Actions/CartActions';
import { RootState } from '../../redux/store';
import {
  defaultDialogValues,
  ConfirmDialog,
  ModalProps,
} from '../ConfirmDialog/ConfirmDialog';

import './ProductCard.scss';

interface PropsType {
  item: ProductType;
}

const ProductCard: React.FC<PropsType> = ({ item }) => {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const itemInCart = cartItems.find((cartitem) => cartitem._id === item._id);
  const dispatch = useDispatch();

  const [modalProps, setModalProps] = useState<ModalProps>(defaultDialogValues);

  return (
    <>
      <ConfirmDialog {...modalProps} />
      <div className={`product-card`}>
        <div className='image-container'>
          <img src={item.image} alt={item.name} className='product-image' />
        </div>
        <span className='product-name'>{item.name}</span>
        <span className='price'>Rs. {item.price}</span>
        {itemInCart && (
          <span className='quantity'>{itemInCart.quantity} in cart</span>
        )}{' '}
        {item.inStock ? (
          <button
            className='add-to-cart-btn'
            onClick={() => {
              if (cartItems.length === 0 || item.shop === cartItems[0].shop) {
                dispatch(addItemToCart(item));
              } else {
                setModalProps({
                  header: 'Do you want to proceed',
                  main: 'Your Cart Items are from different shop, This Action will remove all items belonging to that shop',
                  onConfirm: () => {
                    dispatch(clearCartItems());
                    dispatch(addItemToCart(item));
                    setModalProps(defaultDialogValues);
                  },
                  onExit: () => {
                    setModalProps(defaultDialogValues);
                  },
                  show: true,
                });
              }
            }}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className='add-to-cart-btn'
            disabled={true}
            style={{ background: '#777', cursor: 'not-allowed' }}
          >
            Out Of Stock
          </button>
        )}
      </div>
    </>
  );
};

export default ProductCard;
