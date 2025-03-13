/**
 * @jest-environment jsdom
 */

import { render, act } from '@testing-library/react';
import { usePartnerSettings, PartnerSettingsProvider } from '@/contexts/PartnerSettingsContext';
import { renderHook } from '@testing-library/react-hooks';
import { safeLocalStorage } from '@/lib/safeStorage';

// Mock the safeLocalStorage
jest.mock('@/lib/safeStorage', () => ({
  safeLocalStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
}));

// Test component to ensure the context works properly in components
const TestComponent = () => {
  const { settings, updateSettings, resetSettings } = usePartnerSettings();
  return (
    <div>
      <div data-testid="impact-radius-id">{settings.impactRadiusId}</div>
      <div data-testid="default-link-type">{settings.defaultLinkType}</div>
      <div data-testid="sub-id-1">{settings.subId1}</div>
      <button 
        data-testid="update-button" 
        onClick={() => updateSettings({ impactRadiusId: '987654' })}
      >
        Update
      </button>
      <button 
        data-testid="reset-button" 
        onClick={resetSettings}
      >
        Reset
      </button>
    </div>
  );
};

describe('PartnerSettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any mock implementations
    (safeLocalStorage.getItem as jest.Mock).mockReset();
    (safeLocalStorage.setItem as jest.Mock).mockReset();
  });

  it('should provide default settings when no storage exists', () => {
    // Mock empty storage
    (safeLocalStorage.getItem as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => usePartnerSettings(), {
      wrapper: PartnerSettingsProvider,
    });
    
    // Check default values
    expect(result.current.settings.impactRadiusId).toBe('123456');
    expect(result.current.settings.defaultLinkType).toBe('network');
    expect(result.current.settings.subId1).toBe('');
  });

  it('should load settings from storage if available', () => {
    // Mock storage with values
    const storedSettings = {
      impactRadiusId: '987654',
      defaultLinkType: 'match',
      subId1: 'partner1',
      subId2: 'campaign1',
    };
    
    (safeLocalStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(storedSettings));
    
    const { result } = renderHook(() => usePartnerSettings(), {
      wrapper: PartnerSettingsProvider,
    });
    
    // Check loaded values
    expect(result.current.settings.impactRadiusId).toBe('987654');
    expect(result.current.settings.defaultLinkType).toBe('match');
    expect(result.current.settings.subId1).toBe('partner1');
    expect(result.current.settings.subId2).toBe('campaign1');
  });

  it('should update settings correctly', () => {
    // Start with default settings
    (safeLocalStorage.getItem as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => usePartnerSettings(), {
      wrapper: PartnerSettingsProvider,
    });
    
    // Update settings
    act(() => {
      result.current.updateSettings({
        impactRadiusId: '555555',
        defaultLinkType: 'league',
        subId1: 'custom',
      });
    });
    
    // Check updated values
    expect(result.current.settings.impactRadiusId).toBe('555555');
    expect(result.current.settings.defaultLinkType).toBe('league');
    expect(result.current.settings.subId1).toBe('custom');
    
    // Check that storage was updated
    expect(safeLocalStorage.setItem).toHaveBeenCalledWith(
      'fubo_partner_settings',
      expect.any(String)
    );
  });

  it('should reset settings to defaults', () => {
    // Start with stored settings
    const storedSettings = {
      impactRadiusId: '987654',
      defaultLinkType: 'match',
      subId1: 'partner1',
    };
    
    (safeLocalStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(storedSettings));
    
    const { result } = renderHook(() => usePartnerSettings(), {
      wrapper: PartnerSettingsProvider,
    });
    
    // Reset settings
    act(() => {
      result.current.resetSettings();
    });
    
    // Check reset to defaults
    expect(result.current.settings.impactRadiusId).toBe('123456');
    expect(result.current.settings.defaultLinkType).toBe('network');
    expect(result.current.settings.subId1).toBe('');
    
    // Check that storage was updated
    expect(safeLocalStorage.setItem).toHaveBeenCalledWith(
      'fubo_partner_settings',
      expect.any(String)
    );
  });

  it('should work correctly within a React component', () => {
    // Mock empty storage
    (safeLocalStorage.getItem as jest.Mock).mockReturnValue(null);
    
    const { getByTestId } = render(
      <PartnerSettingsProvider>
        <TestComponent />
      </PartnerSettingsProvider>
    );
    
    // Check initial values
    expect(getByTestId('impact-radius-id').textContent).toBe('123456');
    expect(getByTestId('default-link-type').textContent).toBe('network');
    
    // Trigger an update
    act(() => {
      getByTestId('update-button').click();
    });
    
    // Check updated value
    expect(getByTestId('impact-radius-id').textContent).toBe('987654');
    
    // Reset settings
    act(() => {
      getByTestId('reset-button').click();
    });
    
    // Check reset values
    expect(getByTestId('impact-radius-id').textContent).toBe('123456');
  });
}); 