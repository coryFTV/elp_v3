import v1Config, { V1Config } from './v1.config';
import v2Config, { V2Config } from './v2.config';

// This can be controlled by environment variables or build flags
const USE_V2 = process.env.NEXT_PUBLIC_USE_V2 === 'true';

// Combine the types properly
export type AppConfig = V1Config & {
  version: 'v1' | 'v2';
  features: V1Config['features'] & Partial<V2Config['features']>;
  ui?: V2Config['ui'];
};

// Create the merged config
const config: AppConfig = {
  ...v1Config,
  version: USE_V2 ? 'v2' : 'v1',
  features: {
    ...v1Config.features,
    ...(USE_V2 ? v2Config.features : {})
  },
  ...(USE_V2 ? { ui: v2Config.ui } : {})
};

export default config;

// Helper hooks and utilities
export const isV2 = (): boolean => config.version === 'v2';
export const isFeatureEnabled = (featureName: string): boolean => {
  if (featureName in config.features) {
    return Boolean(config.features[featureName as keyof typeof config.features]);
  }
  return false;
}; 