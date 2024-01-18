import * as types from './cartActionTypes';

export const addToCartAction = (item) => {
  return {
    type: types.ADD_TO_CART,
    payload: item, // You can pass the item data as payload
  };
};

export const removeFromCart = (item) => {
  return {
    type: 'REMOVE_FROM_CART',
    payload: item,
  };
};

export const clearCart = () => {
  return {
    type: types.CLEAR_CART,
  };
};
// Add more action creators for cart operations as needed
