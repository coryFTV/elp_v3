import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PartnerSettings from '../app/partner-settings/page';
import { ToastProvider } from '../contexts/ToastContext';
import { PartnerSettingsProvider } from '../contexts/PartnerSettingsContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/partner-settings'),
}));

// Mock createPortal to avoid DOM testing issues
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Partner Settings Page', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    // Add a portal container for toasts
    const portalRoot = document.createElement('div');
    portalRoot.id = 'toast-portal';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    const portalRoot = document.getElementById('toast-portal');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    jest.clearAllMocks();
  });

  it('renders correctly with breadcrumb and sidebar', async () => {
    render(
      <ToastProvider>
        <PartnerSettingsProvider>
          <PartnerSettings />
        </PartnerSettingsProvider>
      </ToastProvider>
    );

    // Check for breadcrumb
    expect(screen.getByText('Partner Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    
    // Check for sidebar (by looking for the sidebar links)
    expect(screen.getByText('Fubo Affiliate Hub')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-partner-settings')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-sports-schedule')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-movies')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-tv-series')).toBeInTheDocument();
  });

  it('shows a toast notification when settings are saved', async () => {
    const user = userEvent.setup();
    
    render(
      <ToastProvider>
        <PartnerSettingsProvider>
          <PartnerSettings />
        </PartnerSettingsProvider>
      </ToastProvider>
    );

    // Fill out the form
    const partnerIdInput = screen.getByLabelText(/Partner ID/i);
    await user.clear(partnerIdInput);
    await user.type(partnerIdInput, 'testid123');
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    await user.click(saveButton);
    
    // Check that the toast notification appeared
    await waitFor(() => {
      expect(screen.getByText('Settings saved')).toBeInTheDocument();
      expect(screen.getByText('Your partner settings have been updated successfully.')).toBeInTheDocument();
    });
  });
}); 