'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Match } from '@/types/match';

export interface CartItem {
  id: string;
  title: string;
  type: 'match' | 'movie' | 'series';
  data: Match | any; // Type would be more specific in a real app
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = 'fubo-partner-cart';

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load cart from local storage on mount
  useEffect(() => {
    if (isClient) {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, [isClient]);
  
  // Save cart to local storage when it changes
  useEffect(() => {
    if (isClient && cartItems.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems, isClient]);
  
  const addToCart = (item: CartItem) => {
    // Don't add if already in cart
    if (isInCart(item.id)) return;
    
    // Enforce maximum of 5 items
    if (cartItems.length >= 5) {
      if (isClient) {
        alert('You can only select up to 5 items. Please remove some items before adding more.');
      }
      return;
    }
    
    setCartItems([...cartItems, item]);
  };
  
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const isInCart = (id: string) => {
    return cartItems.some(item => item.id === id);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 