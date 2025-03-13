import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PartnerSettingsForm from '@/components/settings/PartnerSettingsForm';
import { PartnerSettingsProvider } from '@/contexts/PartnerSettingsContext';

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

// Mock setTimeout
jest.useFakeTimers();

// Setup mocks
beforeEach(() => {
  // Clear mocks
  jest.clearAllMocks();
  
  // Setup localStorage mock
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
  
  // Mock initial settings
  mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
    partnerId: 'test123',
    defaultCampaign: 'summer2023',
    trackingDomain: 'go.example.com',
  }));
});

// Test component with the provider
const renderWithProvider = () => {
  return render(
    <PartnerSettingsProvider>
      <PartnerSettingsForm />
    </PartnerSettingsProvider>
  );
};

describe('PartnerSettingsForm', () => {
  test('renders form fields with loaded values', async () => {
    renderWithProvider();
    
    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByTestId('partner-id-input')).toHaveValue('test123');
    });
    
    // Check all fields have correct values
    expect(screen.getByTestId('default-campaign-input')).toHaveValue('summer2023');
    expect(screen.getByTestId('tracking-domain-input')).toHaveValue('go.example.com');
  });
  
  test('shows validation error for empty Partner ID', async () => {
    renderWithProvider();
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByTestId('partner-id-input')).toBeInTheDocument();
    });
    
    // Clear the partner ID
    await userEvent.clear(screen.getByTestId('partner-id-input'));
    
    // Submit the form
    await userEvent.click(screen.getByTestId('save-settings-button'));
    
    // Check for validation error
    expect(screen.getByText('Partner ID is required')).toBeInTheDocument();
  });
  
  test('shows validation error for invalid tracking domain', async () => {
    renderWithProvider();
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByTestId('tracking-domain-input')).toBeInTheDocument();
    });
    
    // Enter invalid domain
    await userEvent.clear(screen.getByTestId('tracking-domain-input'));
    await userEvent.type(screen.getByTestId('tracking-domain-input'), 'invalid-domain');
    
    // Submit the form
    await userEvent.click(screen.getByTestId('save-settings-button'));
    
    // Check for validation error
    expect(screen.getByText('Please enter a valid domain')).toBeInTheDocument();
  });
  
  test('successfully saves form data', async () => {
    renderWithProvider();
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByTestId('partner-id-input')).toBeInTheDocument();
    });
    
    // Change some values
    await userEvent.clear(screen.getByTestId('partner-id-input'));
    await userEvent.type(screen.getByTestId('partner-id-input'), 'new123');
    
    await userEvent.clear(screen.getByTestId('default-campaign-input'));
    await userEvent.type(screen.getByTestId('default-campaign-input'), 'winter2023');
    
    // Submit the form
    await userEvent.click(screen.getByTestId('save-settings-button'));
    
    // Advance timers to simulate the API call
    jest.advanceTimersByTime(1000);
    
    // Check success message appears
    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
    
    // Verify localStorage was called with correct data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'partnerSettings',
      JSON.stringify({
        partnerId: 'new123',
        defaultCampaign: 'winter2023',
        trackingDomain: 'go.example.com',
      })
    );
    
    // Success message should disappear after 3 seconds
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(screen.queryByText('Settings saved successfully!')).not.toBeInTheDocument();
    });
  });
  
  test('displays loading state while saving', async () => {
    renderWithProvider();
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByTestId('partner-id-input')).toBeInTheDocument();
    });
    
    // Submit the form
    await userEvent.click(screen.getByTestId('save-settings-button'));
    
    // Check that the button shows loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    
    // Advance timers to complete the API call
    jest.advanceTimersByTime(1000);
    
    // Button should no longer show loading state
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    });
  });
}); 