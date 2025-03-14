import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConfig } from '../../hooks/useConfig';

// Define the media item interface
export interface MediaItem {
  id: string;
  title: string;
  type: 'match' | 'movie' | 'series';
  league?: string;
  network?: string;
  date?: string;
  time?: string;
  sport?: string;
  image?: string;
  url?: string;
}

// Context interface
interface MediaSelectionContextType {
  // V1 terminology
  cartItems: MediaItem[];
  addToCart: (item: MediaItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  
  // V2 terminology
  selectedItems: MediaItem[];
  selectItem: (item: MediaItem, selected: boolean) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  
  // Shared functionality
  getSelectedCount: () => number;
  getSelectedIds: () => string[];
  getSelectedItems: () => MediaItem[];
}

// Create the context
const MediaSelectionContext = createContext<MediaSelectionContextType | undefined>(undefined);

// Provider component
export function MediaSelectionProvider({ children }: { children: ReactNode }) {
  const { isV2 } = useConfig();
  const [items, setItems] = useState<MediaItem[]>([]);
  
  // V1 terminology functions
  const addToCart = (item: MediaItem) => {
    setItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };
  
  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const isInCart = (id: string) => {
    return items.some(item => item.id === id);
  };
  
  // V2 terminology functions
  const selectItem = (item: MediaItem, selected: boolean) => {
    if (selected) {
      addToCart(item);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const clearSelection = () => {
    clearCart();
  };
  
  const isSelected = (id: string) => {
    return isInCart(id);
  };
  
  // Shared functionality
  const getSelectedCount = () => {
    return items.length;
  };
  
  const getSelectedIds = () => {
    return items.map(item => item.id);
  };
  
  const getSelectedItems = () => {
    return [...items];
  };
  
  // Context value
  const value: MediaSelectionContextType = {
    // V1 terminology
    cartItems: items,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    
    // V2 terminology
    selectedItems: items,
    selectItem,
    clearSelection,
    isSelected,
    
    // Shared functionality
    getSelectedCount,
    getSelectedIds,
    getSelectedItems,
  };
  
  return (
    <MediaSelectionContext.Provider value={value}>
      {children}
    </MediaSelectionContext.Provider>
  );
}

// Hook to use the context
export function useMediaSelection() {
  const context = useContext(MediaSelectionContext);
  if (context === undefined) {
    throw new Error('useMediaSelection must be used within a MediaSelectionProvider');
  }
  return context;
}

export default MediaSelectionContext; 