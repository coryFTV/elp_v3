'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartModal } from './CartModal';

export function CartButton() {
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  
  const count = getCartCount();
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="fixed bottom-6 right-6 bg-slate-800 text-white hover:bg-slate-700 rounded-full h-14 w-14 p-0 shadow-lg"
        onClick={openCart}
        data-testid="cart-button"
      >
        <ShoppingCart className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>
      
      <CartModal isOpen={isOpen} onClose={closeCart} />
    </>
  );
} 