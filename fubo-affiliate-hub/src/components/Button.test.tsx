import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  // Test 1: Button renders with correct label
  test('renders with the correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    const buttonElement = screen.getByTestId('custom-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Click me');
  });

  // Test 2: Button triggers onClick when clicked
  test('calls onClick prop when clicked', () => {
    // Create a mock function to track calls
    const handleClick = jest.fn();
    
    // Render button with the mock function
    render(<Button label="Click me" onClick={handleClick} />);
    
    // Find the button and click it
    const buttonElement = screen.getByTestId('custom-button');
    fireEvent.click(buttonElement);
    
    // Verify that the mock function was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 3: Button is disabled when disabled prop is true
  test('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={() => {}} disabled={true} />);
    const buttonElement = screen.getByTestId('custom-button');
    expect(buttonElement).toBeDisabled();
  });

  // Test 4: Button applies custom className
  test('applies custom className', () => {
    render(<Button label="Click me" onClick={() => {}} className="custom-class" />);
    const buttonElement = screen.getByTestId('custom-button');
    expect(buttonElement).toHaveClass('custom-class');
    expect(buttonElement).toHaveClass('btn'); // Default class is still applied
  });
}); 