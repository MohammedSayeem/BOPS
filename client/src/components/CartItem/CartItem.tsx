import React from 'react';
import { useDispatch } from 'react-redux';
import { ProductType } from '../../graphql/types';
import {
  addItemToCart,
  clearItemFromCart,
  removeItemFromCart,
} from '../../redux/Actions/CartActions';

interface CartItemType extends ProductType {
  quantity: number;
}

interface PropsType {
  item: CartItemType;
}

const CartItem: React.FC<PropsType> = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <>
      <li className='cart-item'>
        <div className='image-container'>
          <img src={item.image} alt={item.name} />
        </div>
        <span className='item-name'>{item.name}</span>
        <span className='item-price'>{item.price}</span>
        <div className='quantity'>
          <span
            className='subtract'
            onClick={() => dispatch(removeItemFromCart(item))}
          >
            -
          </span>
          <span>{item.quantity}</span>
          <span className='add' onClick={() => dispatch(addItemToCart(item))}>
            +
          </span>
        </div>
        <i
          className='fas fa-trash-alt remove-icon'
          onClick={() => dispatch(clearItemFromCart(item))}
        ></i>
        <span className='item-total'>Rs {item.quantity * item.price}</span>
      </li>
    </>
  );
};
export default CartItem;
