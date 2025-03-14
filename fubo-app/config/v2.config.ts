/**
 * V2 Configuration
 * Contains feature flags and configuration for v2 functionality
 */

export interface V2Config {
  features: {
    gridViewEnabled: boolean;
    tableViewEnabled: boolean;
    multiSelectFiltersEnabled: boolean;
    liveBadgeEnabled: boolean;
    linkGeneratorModalEnabled: boolean;
    selectForExportEnabled: boolean;
    customExportColumnsEnabled: boolean;
    pastEventsTabEnabled: boolean;
    linkHistoryEnabled: boolean;
  };
  ui: {
    defaultView: 'grid' | 'table';
    defaultItemsPerPage: 25 | 50;
  };
}

const v2Config: V2Config = {
  features: {
    gridViewEnabled: false, // Start with features disabled, enable as they're implemented
    tableViewEnabled: true,
    multiSelectFiltersEnabled: false,
    liveBadgeEnabled: false,
    linkGeneratorModalEnabled: false,
    selectForExportEnabled: false,
    customExportColumnsEnabled: false,
    pastEventsTabEnabled: false,
    linkHistoryEnabled: false,
  },
  ui: {
    defaultView: 'table', // Start with table view as default
    defaultItemsPerPage: 25,
  },
};

export default v2Config; 