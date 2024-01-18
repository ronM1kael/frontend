import * as types from '../Actions/cartActionTypes';

const initialState = {
  cartItems: [],
  // Other initial state properties related to the cart
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload], // Add the new item to the cart
      };
    case types.REMOVE_FROM_CART:
    // Logic to remove item from cart based on action.payload (item ID, for instance)
    // Return updated state without the removed item
    case types.CLEAR_CART:
      return {
        ...state,
        cartItems: [], // Reset cartItems to an empty array
      };
    // Handle other action types if needed
    default:
      return state;
  }
};

export default cartReducer;
