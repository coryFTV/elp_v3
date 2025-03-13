import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Toast } from '../components/ui/toast';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with the correct title and description', () => {
    const onCloseMock = jest.fn();

    render(
      <Toast
        id="test-toast"
        title="Test Title"
        description="Test description"
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('calls onClose after the duration ends', async () => {
    const onCloseMock = jest.fn();

    render(
      <Toast
        id="test-toast"
        title="Test Title"
        duration={1000}
        onClose={onCloseMock}
      />
    );

    // Advance timers by the duration plus animation time
    act(() => {
      jest.advanceTimersByTime(1300);
    });

    // Wait for the callback to be called
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledWith('test-toast');
    });
  });

  it('closes when the close button is clicked', async () => {
    const onCloseMock = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <Toast
        id="test-toast"
        title="Test Title"
        onClose={onCloseMock}
      />
    );

    // Click the close button
    const closeButton = screen.getByLabelText('Close toast');
    await user.click(closeButton);
    
    // Advance timers to account for the exit animation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledWith('test-toast');
    });
  });

  it('applies the correct styles for different variants', () => {
    const { rerender } = render(
      <Toast
        id="test-toast"
        title="Success Toast"
        variant="success"
        onClose={jest.fn()}
      />
    );

    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('bg-green-50');

    rerender(
      <Toast
        id="test-toast"
        title="Error Toast"
        variant="error"
        onClose={jest.fn()}
      />
    );

    expect(toast).toHaveClass('bg-red-50');
  });
}); 