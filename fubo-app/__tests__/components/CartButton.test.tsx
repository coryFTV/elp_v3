import { render, screen, fireEvent } from '@testing-library/react';
import { CartButton } from '@/components/cart/CartButton';
import { CartProvider, CartItem } from '@/contexts/CartContext';
import React from 'react';

// Mock the cart modal since we're testing the button separately
jest.mock('@/components/cart/CartModal', () => ({
  CartModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div data-testid="mock-cart-modal">Mock Cart Modal <button onClick={onClose}>Close</button></div> : null
  )
}));

// Mock useCart hook with various scenarios
const mockUseCart = {
  getCartCount: jest.fn().mockReturnValue(0),
  cartItems: [],
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  isInCart: jest.fn(),
  getAffiliateLinks: jest.fn()
};

jest.mock('@/contexts/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useCart: () => mockUseCart,
  CartItem: {}
}));

describe('CartButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the cart button with no items', () => {
    mockUseCart.getCartCount.mockReturnValue(0);
    
    render(<CartButton />);
    
    // Should display the button without a counter
    const button = screen.getByTestId('cart-button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument(); // Counter shouldn't be visible when 0
  });
  
  it('displays the cart count when items are in the cart', () => {
    mockUseCart.getCartCount.mockReturnValue(3);
    
    render(<CartButton />);
    
    // Should display the button with a counter
    const button = screen.getByTestId('cart-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
  it('opens the cart modal when clicked', () => {
    render(<CartButton />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('mock-cart-modal')).not.toBeInTheDocument();
    
    // Click the cart button
    fireEvent.click(screen.getByTestId('cart-button'));
    
    // Modal should now be visible
    expect(screen.getByTestId('mock-cart-modal')).toBeInTheDocument();
  });
  
  it('closes the cart modal when the close button is clicked', () => {
    render(<CartButton />);
    
    // Open the modal first
    fireEvent.click(screen.getByTestId('cart-button'));
    expect(screen.getByTestId('mock-cart-modal')).toBeInTheDocument();
    
    // Click the close button
    fireEvent.click(screen.getByText('Close'));
    
    // Modal should now be hidden
    expect(screen.queryByTestId('mock-cart-modal')).not.toBeInTheDocument();
  });
}); 