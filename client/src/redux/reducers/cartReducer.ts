import { ProductType } from '../../graphql/types';
import { CartActionTypes } from '../ActionTypes/CartActionTypes';

const INITIAL_STATE: StateType = {
  cartItems: [],
  cartTotal: 0,
};
interface CartItemType extends ProductType {
  quantity: number;
}
interface StateType {
  cartItems: CartItemType[];
  cartTotal: number;
}
interface AddItemToCartAction {
  type: CartActionTypes.ADD_ITEM_TO_CART;
  payload: ProductType;
}
interface RemoveItemFromCartAction {
  type: CartActionTypes.REMOVE_ITEM_FROM_CART;
  payload: ProductType;
}
interface ClearItemFromCartAction {
  type: CartActionTypes.CLEAR_ITEM_FROM_CART;
  payload: ProductType;
}
interface ClearCartItemsAction {
  type: CartActionTypes.CLEAR_CART_ITEMS;
}
type ActionType =
  | AddItemToCartAction
  | ClearCartItemsAction
  | RemoveItemFromCartAction
  | ClearItemFromCartAction;

const AddItemToCart = (cartItems: CartItemType[], ItemToAdd: ProductType) => {
  const existingItems = cartItems.find(
    (cartItem) => cartItem._id === ItemToAdd._id
  );
  if (existingItems) {
    return cartItems.map((cartItem) =>
      cartItem._id === ItemToAdd._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }
  return [...cartItems, { ...ItemToAdd, quantity: 1 }];
};
const removeItemFromCart = (
  cartItems: CartItemType[],
  cartItemToRemove: ProductType
) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem._id === cartItemToRemove._id
  );

  if (existingCartItem && existingCartItem.quantity === 1) {
    return cartItems.filter(
      (cartItem) => cartItem._id !== cartItemToRemove._id
    );
  }

  return cartItems.map((cartItem) =>
    cartItem._id === cartItemToRemove._id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const reducer = (
  state: StateType = INITIAL_STATE,
  action: ActionType
): StateType => {
  switch (action.type) {
    case CartActionTypes.ADD_ITEM_TO_CART: {
      return {
        ...state,
        cartItems: AddItemToCart(state.cartItems, action.payload),
      };
    }
    case CartActionTypes.CLEAR_ITEM_FROM_CART: {
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (cartItem) => cartItem._id !== action.payload._id
        ),
      };
    }
    case CartActionTypes.REMOVE_ITEM_FROM_CART: {
      return {
        ...state,
        cartItems: removeItemFromCart(state.cartItems, action.payload),
      };
    }
    case CartActionTypes.CLEAR_CART_ITEMS: {
      return {
        ...state,
        cartItems: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;
