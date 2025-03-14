import { useCallback } from 'react';
import config, { isV2, isFeatureEnabled, AppConfig } from '../config';

/**
 * Hook to access application configuration and feature flags
 */
export function useConfig() {
  const checkFeature = useCallback((featureName: string): boolean => {
    return isFeatureEnabled(featureName);
  }, []);

  const checkVersion = useCallback((): boolean => {
    return isV2();
  }, []);

  return {
    config,
    isV2: checkVersion,
    isFeatureEnabled: checkFeature,
    // Helper for specific features
    isGridViewEnabled: () => checkFeature('gridViewEnabled'),
    isTableViewEnabled: () => checkFeature('tableViewEnabled'),
    isMultiSelectFiltersEnabled: () => checkFeature('multiSelectFiltersEnabled'),
    isLiveBadgeEnabled: () => checkFeature('liveBadgeEnabled'),
    isLinkGeneratorModalEnabled: () => checkFeature('linkGeneratorModalEnabled'),
    isSelectForExportEnabled: () => checkFeature('selectForExportEnabled'),
    isCustomExportColumnsEnabled: () => checkFeature('customExportColumnsEnabled'),
    isPastEventsTabEnabled: () => checkFeature('pastEventsTabEnabled'),
    isLinkHistoryEnabled: () => checkFeature('linkHistoryEnabled'),
  };
}

export default useConfig; 