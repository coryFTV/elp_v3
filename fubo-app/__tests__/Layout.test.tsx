import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Layout } from '@/components/Layout';

// Mock the usePathname hook from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Layout', () => {
  it('renders the sidebar with all navigation links', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check if the heading exists
    expect(screen.getByText('Fubo Affiliate Hub')).toBeInTheDocument();
    
    // Check if all navigation links are rendered
    expect(screen.getByTestId('nav-link-sports-schedule')).toHaveTextContent('Sports Schedule');
    expect(screen.getByTestId('nav-link-movies')).toHaveTextContent('Movies');
    expect(screen.getByTestId('nav-link-tv-series')).toHaveTextContent('TV Series');
    expect(screen.getByTestId('nav-link-partner-settings')).toHaveTextContent('Partner Settings');
    
    // Verify children are rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 