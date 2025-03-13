'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeLocalStorage } from '@/lib/safeStorage';

// Define the types of link that can be generated
export type LinkType = 'network' | 'match' | 'league';

// Define the shape of the settings object
export interface PartnerSettings {
  partnerId: string;
  defaultCampaign: string;
  trackingDomain: string;
}

// Define the default settings
const defaultSettings: PartnerSettings = {
  partnerId: '',
  defaultCampaign: '',
  trackingDomain: '',
};

// Local storage key
const STORAGE_KEY = 'fubo_partner_settings';

// Define the context value interface
interface PartnerSettingsContextValue {
  settings: PartnerSettings;
  isLoading: boolean;
  saveSettings: (settings: PartnerSettings) => Promise<void>;
}

// Create the context
const PartnerSettingsContext = createContext<PartnerSettingsContextValue | undefined>(undefined);

// Provider component
interface PartnerSettingsProviderProps {
  children: ReactNode;
}

export function PartnerSettingsProvider({ children }: PartnerSettingsProviderProps) {
  const [settings, setSettings] = useState<PartnerSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load settings from local storage on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = safeLocalStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Failed to parse partner settings:', error);
          // If parsing fails, reset to defaults
          setSettings(defaultSettings);
        }
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to local storage whenever they change
  useEffect(() => {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);
  
  // Fetch settings from API or local storage
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use localStorage as a demo
        const savedSettings = localStorage.getItem('partnerSettings');
        
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load partner settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);
  
  // Save settings
  const saveSettings = async (newSettings: PartnerSettings): Promise<void> => {
    setIsLoading(true);
    
    try {
      // In a real app, you would save to an API
      // For demo purposes, save to localStorage with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('partnerSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save partner settings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create the context value
  const contextValue: PartnerSettingsContextValue = {
    settings,
    isLoading,
    saveSettings,
  };
  
  return (
    <PartnerSettingsContext.Provider value={contextValue}>
      {children}
    </PartnerSettingsContext.Provider>
  );
}

// Custom hook to use the context
export function usePartnerSettings() {
  const context = useContext(PartnerSettingsContext);
  
  if (context === undefined) {
    throw new Error('usePartnerSettings must be used within a PartnerSettingsProvider');
  }
  
  return context;
} 