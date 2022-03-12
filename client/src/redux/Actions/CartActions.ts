import { ProductType } from '../../graphql/types';
import { CartActionTypes } from '../ActionTypes/CartActionTypes';

export const addItemToCart = (item: ProductType) => ({
  type: CartActionTypes.ADD_ITEM_TO_CART,
  payload: item,
});
export const removeItemFromCart = (item: ProductType) => ({
  type: CartActionTypes.REMOVE_ITEM_FROM_CART,
  payload: item,
});
export const clearItemFromCart = (item: ProductType) => ({
  type: CartActionTypes.CLEAR_ITEM_FROM_CART,
  payload: item,
});
export const clearCartItems = () => ({
  type: CartActionTypes.CLEAR_CART_ITEMS,
});
