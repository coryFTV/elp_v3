import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart, CartItem } from '@/contexts/CartContext';
import React from 'react';

// Mock the safe storage module
jest.mock('@/lib/safeStorage', () => ({
  safeLocalStorage: {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
}));

// Mock the affiliate link service
jest.mock('@/services/affiliateLinkService', () => ({
  buildLeagueUrl: jest.fn().mockReturnValue('https://mock-league-url.com'),
  buildMatchUrl: jest.fn().mockReturnValue('https://mock-match-url.com'),
  buildNetworkUrl: jest.fn().mockReturnValue('https://mock-network-url.com')
}));

// Sample movie item for testing
const movieItem: CartItem = {
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
    duration: 120,
    director: 'Test Director',
    network: 'Test Network',
    imageUrl: '/test-image.jpg',
    actors: ['Actor 1', 'Actor 2'],
    streamingUrl: 'https://example.com/stream/movie-1',
    networkId: 'test-network',
    regionalRestrictions: false
  }
};

// Sample series item for testing
const seriesItem: CartItem = {
  id: 'series-1',
  title: 'Test Series',
  type: 'series',
  data: {
    id: 'series-1',
    title: 'Test Series',
    description: 'A test series',
    genre: 'Drama',
    rating: 4.8,
    startYear: 2020,
    endYear: 2023,
    seasons: 3,
    creator: 'Test Creator',
    network: 'Test Network',
    imageUrl: '/test-series-image.jpg',
    actors: ['Actor 1', 'Actor 2'],
    episodes: 24,
    streamingUrl: 'https://example.com/stream/series-1',
    networkId: 'test-network',
    regionalRestrictions: false
  }
};

// Sample match item for testing
const matchItem: CartItem = {
  id: 'match-1',
  title: 'Team A vs Team B',
  type: 'match',
  data: {
    id: 'match-1',
    title: 'Team A vs Team B',
    hometeam: 'Team A',
    awayteam: 'Team B',
    hometeamabbr: 'TA',
    awayteamabbr: 'TB',
    hometeamID: 'team-a',
    awayteamID: 'team-b',
    starttime: '2023-12-01T19:00:00Z',
    endtime: '2023-12-01T21:00:00Z',
    sport: 'Football',
    league: 'NFL',
    league_id: 'nfl',
    network: 'ESPN',
    networkUrl: 'https://espn.com',
    matchId: 'match-1',
    matchUrl: 'https://example.com/match-1',
    thumbnail: 'https://example.com/thumbnail.jpg',
    country: 'USA',
    url: 'https://example.com/match-1',
    regionalRestrictions: false
  }
};

// A wrapper component to test the useCart hook
const TestComponent = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    isInCart, 
    getCartCount,
    getAffiliateLinks 
  } = useCart();
  
  return (
    <div>
      <div data-testid="cart-count">{getCartCount()}</div>
      <button 
        data-testid="add-movie" 
        onClick={() => addToCart(movieItem)}
      >
        Add Movie
      </button>
      <button 
        data-testid="add-series" 
        onClick={() => addToCart(seriesItem)}
      >
        Add Series
      </button>
      <button 
        data-testid="add-match" 
        onClick={() => addToCart(matchItem)}
      >
        Add Match
      </button>
      <button 
        data-testid="remove-movie" 
        onClick={() => removeFromCart(movieItem.id)}
      >
        Remove Movie
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={() => clearCart()}
      >
        Clear Cart
      </button>
      <div data-testid="is-movie-in-cart">
        {isInCart(movieItem.id) ? 'Yes' : 'No'}
      </div>
      <div data-testid="cart-items">
        {cartItems.map(item => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.title}
          </div>
        ))}
      </div>
      <button 
        data-testid="get-links" 
        onClick={() => console.log(getAffiliateLinks())}
      >
        Get Links
      </button>
    </div>
  );
};

// Custom wrapper for testing hooks
const renderWithCart = (ui: React.ReactElement) => {
  return render(
    <CartProvider>
      {ui}
    </CartProvider>
  );
};

describe('CartContext', () => {
  it('should add an item to the cart', () => {
    renderWithCart(<TestComponent />);
    
    // Initially the cart count should be 0
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('is-movie-in-cart').textContent).toBe('No');
    
    // Add a movie to the cart
    fireEvent.click(screen.getByTestId('add-movie'));
    
    // Now the cart should have 1 item
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('is-movie-in-cart').textContent).toBe('Yes');
    expect(screen.getByTestId('cart-item-movie-1')).toBeInTheDocument();
  });
  
  it('should remove an item from the cart', () => {
    renderWithCart(<TestComponent />);
    
    // Add a movie to the cart
    fireEvent.click(screen.getByTestId('add-movie'));
    
    // Verify the movie is in the cart
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    
    // Remove the movie from the cart
    fireEvent.click(screen.getByTestId('remove-movie'));
    
    // The cart should be empty again
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('is-movie-in-cart').textContent).toBe('No');
    expect(screen.queryByTestId('cart-item-movie-1')).not.toBeInTheDocument();
  });
  
  it('should clear all items from the cart', () => {
    renderWithCart(<TestComponent />);
    
    // Add multiple items to the cart
    fireEvent.click(screen.getByTestId('add-movie'));
    fireEvent.click(screen.getByTestId('add-series'));
    fireEvent.click(screen.getByTestId('add-match'));
    
    // Verify items are in the cart
    expect(screen.getByTestId('cart-count').textContent).toBe('3');
    
    // Clear the cart
    fireEvent.click(screen.getByTestId('clear-cart'));
    
    // The cart should be empty
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.queryByTestId('cart-item-movie-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-item-series-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-item-match-1')).not.toBeInTheDocument();
  });
  
  it('should not add more than 5 items to the cart', () => {
    const TestComponentFor5Items = () => {
      const { addToCart, getCartCount } = useCart();
      
      // Create 6 different items
      const items = Array.from({ length: 6 }, (_, i) => ({
        id: `item-${i}`,
        title: `Item ${i}`,
        type: 'movie' as const,
        data: {
          ...movieItem.data,
          id: `item-${i}`,
          title: `Item ${i}`
        }
      }));
      
      const addItems = () => {
        // Try to add all 6 items
        const results = items.map(item => addToCart(item));
        return results;
      };
      
      return (
        <div>
          <div data-testid="cart-count">{getCartCount()}</div>
          <button data-testid="add-items" onClick={addItems}>Add Items</button>
        </div>
      );
    };
    
    renderWithCart(<TestComponentFor5Items />);
    
    // Add items
    fireEvent.click(screen.getByTestId('add-items'));
    
    // Should only have 5 items in the cart
    expect(screen.getByTestId('cart-count').textContent).toBe('5');
  });
  
  it('should generate affiliate links for cart items', () => {
    const TestComponentForLinks = () => {
      const { addToCart, getAffiliateLinks } = useCart();
      
      const addItems = () => {
        addToCart(movieItem);
        addToCart(seriesItem);
        addToCart(matchItem);
      };
      
      const [links, setLinks] = React.useState<{ title: string; url: string }[]>([]);
      
      const generateLinks = () => {
        setLinks(getAffiliateLinks());
      };
      
      return (
        <div>
          <button data-testid="add-items" onClick={addItems}>Add Items</button>
          <button data-testid="generate-links" onClick={generateLinks}>Generate Links</button>
          <div data-testid="links-count">{links.length}</div>
          {links.map((link, index) => (
            <div key={index} data-testid={`link-${index}`}>
              <span data-testid={`link-title-${index}`}>{link.title}</span>
              <span data-testid={`link-url-${index}`}>{link.url}</span>
            </div>
          ))}
        </div>
      );
    };
    
    renderWithCart(<TestComponentForLinks />);
    
    // Add items
    fireEvent.click(screen.getByTestId('add-items'));
    
    // Generate links
    fireEvent.click(screen.getByTestId('generate-links'));
    
    // Should have 3 links
    expect(screen.getByTestId('links-count').textContent).toBe('3');
    
    // Check link titles
    expect(screen.getByTestId('link-title-0').textContent).toBe('Test Movie');
    expect(screen.getByTestId('link-title-1').textContent).toBe('Test Series');
    expect(screen.getByTestId('link-title-2').textContent).toBe('Team A vs Team B');
    
    // Check URLs (using mock returns)
    expect(screen.getByTestId('link-url-0').textContent).toBe('https://mock-network-url.com');
    expect(screen.getByTestId('link-url-1').textContent).toBe('https://mock-network-url.com');
    expect(screen.getByTestId('link-url-2').textContent).toBe('https://mock-match-url.com');
  });
}); 