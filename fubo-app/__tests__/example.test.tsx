import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Example test', () => {
  it('renders a heading', () => {
    // Arrange
    render(<h1>Welcome to our app</h1>);
    
    // Act & Assert
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Welcome to our app');
  });
}); 