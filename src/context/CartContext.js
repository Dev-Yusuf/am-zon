import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'amazon_clone_cart';

const initialState = {
  items: [],
  savedForLater: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
                JSON.stringify(item.selectedVariant) === JSON.stringify(action.payload.selectedVariant)
      );
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (action.payload.quantity || 1)
        };
        return { ...state, items: newItems };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const newItems = [...state.items];
      newItems[action.payload.index] = {
        ...newItems[action.payload.index],
        quantity: action.payload.quantity
      };
      return { ...state, items: newItems };
    }
    
    case 'SAVE_FOR_LATER': {
      const item = state.items[action.payload];
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload),
        savedForLater: [...state.savedForLater, item]
      };
    }
    
    case 'MOVE_TO_CART': {
      const item = state.savedForLater[action.payload];
      return {
        ...state,
        savedForLater: state.savedForLater.filter((_, index) => index !== action.payload),
        items: [...state.items, item]
      };
    }
    
    case 'REMOVE_SAVED':
      return {
        ...state,
        savedForLater: state.savedForLater.filter((_, index) => index !== action.payload)
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...product, selectedVariant, quantity } 
    });
  };

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_ITEM', payload: index });
  };

  const updateQuantity = (index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };

  const saveForLater = (index) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: index });
  };

  const moveToCart = (index) => {
    dispatch({ type: 'MOVE_TO_CART', payload: index });
  };

  const removeSaved = (index) => {
    dispatch({ type: 'REMOVE_SAVED', payload: index });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      savedForLater: state.savedForLater,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      removeSaved,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
