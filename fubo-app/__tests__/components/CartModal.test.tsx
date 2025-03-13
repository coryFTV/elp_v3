/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartModal } from '@/components/cart/CartModal';
import { CartItem } from '@/contexts/CartContext';

// Create a custom render function that works with React 18
const customRender = (ui: React.ReactElement) => {
  // Create a container element
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  return render(ui, { container });
};

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  Clipboard: () => <div data-testid="clipboard-icon">Clipboard</div>,
  Trash: () => <div data-testid="trash-icon">Trash</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
}));

// Mock the Alert component and other UI components
jest.mock('../../components/ui/alert', () => ({
  Alert: ({ children, variant }: any) => (
    <div data-testid="mock-alert" data-variant={variant}>{children}</div>
  ),
  AlertDescription: ({ children }: any) => <div data-testid="alert-description">{children}</div>
}));

// Mock the Button component
jest.mock('../../components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled, 
    className, 
    'data-testid': dataTestId,
    variant
  }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className} 
      data-testid={dataTestId || 'mock-button'}
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

// Sample cart items for testing
const cartItems: CartItem[] = [
  {
    id: 'movie-1',
    title: 'Test Movie',
    type: 'movie',
    data: {
      id: 'movie-1',
      title: 'Test Movie',
      description: 'A test movie',
      genre: 'Action',
      rating: 4.5,
      releaseYear: 2023,
      network: 'Test Network',
    }
  },
  {
    id: 'series-1',
    title: 'Test Series',
    type: 'series',
    data: {
      id: 'series-1',
      title: 'Test Series',
      description: 'A test series',
      genre: 'Drama',
      rating: 4.8,
      network: 'Test Network',
    }
  }
];

// Mock the affiliate link service
jest.mock('@/services/affiliateLinkService', () => ({
  buildLeagueUrl: jest.fn().mockReturnValue('https://mock-league-url.com'),
  buildMatchUrl: jest.fn().mockReturnValue('https://mock-match-url.com'),
  buildNetworkUrl: jest.fn().mockReturnValue('https://mock-network-url.com'),
}));

// Create mock functions for the cart context
const mockRemoveFromCart = jest.fn();
const mockClearCart = jest.fn();
const mockGetAffiliateLinks = jest.fn().mockReturnValue([
  { title: 'Test Movie', url: 'https://mock-network-url.com' },
  { title: 'Test Series', url: 'https://mock-network-url.com' },
]);

// Mock the useCart hook
jest.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    cartItems,
    removeFromCart: mockRemoveFromCart,
    clearCart: mockClearCart,
    getAffiliateLinks: mockGetAffiliateLinks,
  }),
}));

describe('CartModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    customRender(<CartModal isOpen={false} onClose={jest.fn()} />);
    expect(document.body.textContent).toBe('');
  });

  it('should render when isOpen is true', () => {
    customRender(<CartModal isOpen={true} onClose={jest.fn()} />);
    // Just check that something is rendered
    expect(document.body.textContent).not.toBe('');
  });

  it('should render empty cart message when cart is empty', () => {
    // Override the mock to return an empty cart
    jest.spyOn(require('@/contexts/CartContext'), 'useCart').mockReturnValue({
      cartItems: [],
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      getAffiliateLinks: jest.fn().mockReturnValue([]),
    });
    
    customRender(<CartModal isOpen={true} onClose={jest.fn()} />);
    
    // Check that the empty cart message is in the document
    expect(document.body.textContent).toContain('Your cart is empty');
  });
}); 