import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/test-path'),
}));

describe('Breadcrumb Component', () => {
  it('renders home icon and breadcrumb items', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Test Page', href: '/test', isCurrent: true }
        ]}
      />
    );
    
    // Check for home icon (it has an aria-label="Home")
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    
    // Check for the breadcrumb item
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test Page')).toHaveAttribute('aria-current', 'page');
  });
  
  it('renders multiple breadcrumb items correctly', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Parent', href: '/parent' },
          { label: 'Child', href: '/parent/child', isCurrent: true }
        ]}
      />
    );
    
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
    
    // Parent should be a link, Child should be a span with aria-current
    expect(screen.getByText('Parent').closest('a')).toHaveAttribute('href', '/parent');
    expect(screen.getByText('Child')).toHaveAttribute('aria-current', 'page');
  });
}); 