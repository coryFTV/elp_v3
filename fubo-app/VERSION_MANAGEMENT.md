# Version Management Guide

This document explains how the project is structured to maintain v1 functionality while preparing for v2 updates.

## Directory Structure

The project uses a version-based directory structure to separate v1 and v2 code:

```
fubo-app/
├── components/            
│   ├── v1/                # Original v1 components
│   ├── v2/                # New v2 components
│   └── shared/            # Components shared between v1 and v2
├── contexts/              
│   ├── v1/                # Original v1 contexts
│   ├── v2/                # Enhanced v2 contexts
│   └── shared/            # Contexts used by both versions
├── lib/                   
│   ├── v1/                # Original utility functions
│   ├── v2/                # Enhanced utility functions
│   └── shared/            # Shared utilities
├── services/              
│   ├── v1/                # Original business logic
│   ├── v2/                # Enhanced business logic
│   └── shared/            # Shared services
├── types/                 
│   ├── v1/                # Original type definitions
│   ├── v2/                # Enhanced type definitions
│   └── shared/            # Shared types
└── config/
    ├── v1.config.ts       # v1 feature flags and configuration
    ├── v2.config.ts       # v2 feature flags and configuration
    └── index.ts           # Exports the active configuration
```

## Feature Flags

The project uses feature flags to control which version of the code is used. These flags are defined in the `.env.local` file and can be toggled to enable or disable v2 features.

### Main Version Flag

```
NEXT_PUBLIC_USE_V2=false
```

Set this to `true` to enable v2 features.

### Individual Feature Flags

```
NEXT_PUBLIC_ENABLE_GRID_VIEW=false
NEXT_PUBLIC_ENABLE_MULTI_SELECT_FILTERS=false
NEXT_PUBLIC_ENABLE_LIVE_BADGE=false
NEXT_PUBLIC_ENABLE_LINK_GENERATOR_MODAL=false
NEXT_PUBLIC_ENABLE_SELECT_FOR_EXPORT=false
NEXT_PUBLIC_ENABLE_CUSTOM_EXPORT_COLUMNS=false
NEXT_PUBLIC_ENABLE_PAST_EVENTS_TAB=false
NEXT_PUBLIC_ENABLE_LINK_HISTORY=false
```

These flags control individual v2 features and can be toggled independently.

## Configuration System

The configuration system is defined in the `config/` directory:

- `v1.config.ts`: Contains v1 feature flags and configuration
- `v2.config.ts`: Contains v2 feature flags and configuration
- `index.ts`: Exports the active configuration based on the feature flags

## Using the Configuration in Components

Use the `useConfig` hook to access the configuration in components:

```tsx
import { useConfig } from '../hooks/useConfig';

function MyComponent() {
  const { isV2, isGridViewEnabled } = useConfig();
  
  if (isV2() && isGridViewEnabled()) {
    return <V2Component />;
  }
  
  return <V1Component />;
}
```

## Component Versioning

Components can be versioned using the shared component pattern:

```tsx
// components/shared/MediaCard.tsx
import { useConfig } from '../../hooks/useConfig';
import V1MediaCard from '../v1/MediaCard';
import V2MediaCard from '../v2/MediaCard';

export default function MediaCard(props) {
  const { isV2, isGridViewEnabled } = useConfig();
  
  if (isV2() && isGridViewEnabled()) {
    return <V2MediaCard {...props} />;
  }
  
  return <V1MediaCard {...props} />;
}
```

## Data Adapters

Data adapters are used to transform data between v1 and v2 formats:

```tsx
// lib/shared/dataAdapters.ts
export function adaptMatch(match: RawMatch): MediaItem {
  // Format date and time
  const date = formatDate(match.startTime);
  const time = convertToEST(match.startTime);
  
  // Handle network (string in v1, array in v2)
  const network = Array.isArray(match.network) 
    ? match.network.join(', ') 
    : match.network;
  
  return {
    id: match.id,
    title: match.title,
    type: 'match',
    league: match.league,
    network,
    date,
    time,
    sport: match.sport,
    image: match.thumbnail,
  };
}
```

## Branching Strategy

The project uses the following branching strategy:

1. `main`: The main branch that contains the latest stable code
2. `stable/v1`: A stable branch that contains only v1 code
3. `develop/v2`: A development branch for v2 features
4. Feature branches: Created from `develop/v2` for individual v2 features

## Phased Implementation

The v2 features are implemented in phases:

1. Phase 1: UI & Navigation
   - Partner Settings integration
   - Sports Schedule redesign (Grid View, Table View toggle, LIVE badge)

2. Phase 2: Filters & Sorting
   - Multi-select filters
   - Sorting dropdown
   - Pagination

3. Phase 3: Link Generator & Export
   - Link Generator modal
   - Select for Export
   - CSV & Clipboard export

4. Phase 4: Past Events & Final Enhancements
   - Past Events tab
   - Data deduplication
   - Link history

## Testing Strategy

The project uses the following testing strategy:

1. Unit tests for individual components and functions
2. Integration tests for component interactions
3. End-to-end tests for user flows

Tests are organized in the same version-based structure as the code:

```
__tests__/
├── v1/
├── v2/
└── shared/
```

## Deployment Strategy

The project uses a phased deployment strategy:

1. Deploy v1 code with v2 feature flags disabled
2. Enable v2 feature flags one by one in production
3. Monitor for issues and roll back if necessary
4. Once all v2 features are stable, remove v1 code 