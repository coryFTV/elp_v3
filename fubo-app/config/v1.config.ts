/**
 * V1 Configuration
 * Contains feature flags and configuration for v1 functionality
 */

export interface V1Config {
  features: {
    cartEnabled: boolean;
    partnerSettingsEnabled: boolean;
    exportEnabled: boolean;
    filteringEnabled: boolean;
  };
  limits: {
    maxCartItems: number;
  };
}

const v1Config: V1Config = {
  features: {
    cartEnabled: true,
    partnerSettingsEnabled: true,
    exportEnabled: true,
    filteringEnabled: true,
  },
  limits: {
    maxCartItems: 5,
  },
};

export default v1Config; 