# V2 TODO Checklist

Use this file as a detailed checklist to track and confirm each V2 feature. Mark off tasks once they're completed and tested.

---

## Phase 1: UI & Navigation

- [x] **Partner Settings Page**
  - [x] Embed page in main layout (sidebar + breadcrumb)
  - [x] Match styling with other app sections
  - [x] Toast confirmation on save
  - [x] **Tests**: Verify sidebar, breadcrumb, and save messages

- [ ] **Sports Schedule Redesign**
  - [ ] Remove start/end time filters
  - [ ] Create Grid View (default) with thumbnail, date/time (EST), network, league, LIVE badge
  - [ ] Toggle button to switch to Table View
  - [ ] **Tests**: Check grid rendering, table toggle, LIVE badge logic

---

## Phase 2: Filters & Sorting

- [ ] **Multi-Select Filter Bar**
  - [ ] Implement league, network, and sport filters
  - [ ] Clicking tags in match cards auto-adds filters
  - [ ] AND logic for multiple selections
  - [ ] **Tests**: Confirm multi-select + auto-apply

- [ ] **Sorting Dropdown**
  - [ ] Options: Chronological (default), League, Network, Sport
  - [ ] Auto-apply sorting on selection
  - [ ] **Tests**: Validate sorting order changes

- [ ] **Pagination**
  - [ ] Default 25 items/page, option for 50
  - [ ] Next/Previous + numbered pagination
  - [ ] **Tests**: Ensure pagination works with filters & sorting

---

## Phase 3: Link Generator & Export

- [ ] **Link Generator Modal**
  - [ ] Menu bar for link type (Match, League, Network)
  - [ ] Auto-fill from Partner Settings (IRMP, SubIds)
  - [ ] Copy Link + Test Link buttons, live preview
  - [ ] **Tests**: Modal open/close, link generation, copy/test functions

- [ ] **Select for Export**
  - [ ] Rename "Add to Cart" to "Select for Export"
  - [ ] Event checkboxes, "Export Selected" button when > 0 selected
  - [ ] **Tests**: Selection flow, correct events exported

- [ ] **CSV & Clipboard Export**
  - [ ] Default columns: Event Name, League, Affiliate Link
  - [ ] Additional columns (Sport, Network, Start Time) toggled in Partner Settings
  - [ ] Implement CSV download + copy to clipboard
  - [ ] **Tests**: Verify CSV structure, partial column sets, clipboard

---

## Phase 4: Past Events & Final Enhancements

- [ ] **Past Events Tab**
  - [ ] Expired matches move here, dimmed gray
  - [ ] Same filters, sorting, pagination
  - [ ] **Tests**: Check behavior with feed changes (API integration)

- [ ] **Data Deduplication**
  - [ ] Merge duplicate matchups in JSON feed
  - [ ] List multiple networks horizontally
  - [ ] **Tests**: Ensure no duplicate displays, correct network listing

- [ ] **Partner Settings Link History**
  - [ ] Log of generated links (date/time, type, URL)
  - [ ] Options to remove single entries or clear all
  - [ ] No expiration
  - [ ] **Tests**: Confirm logs persist, deletion works

---

## Phase 5: Advanced Features

- [ ] **Reports Dashboard**
  - [ ] Implement charts for impressions, clicks, and conversions
  - [ ] Add date range selector for filtering performance data
  - [ ] Create summary metrics cards for key performance indicators
  - [ ] **Tests**: Verify charts render correctly with sample data

- [ ] **Authentication System**
  - [ ] Implement sign-up and login functionality
  - [ ] Create user profiles and role management
  - [ ] Apply route protection based on user roles
  - [ ] **Tests**: Test authentication flows, role-based access

- [ ] **Real-time API Integration**
  - [ ] Create API client for fetching Fubo content
  - [ ] Implement caching strategy for performance
  - [ ] Add error handling and retry logic
  - [ ] **Tests**: Verify API response handling, caching, error recovery

---

## Testing & Deployment

- [ ] **Unit Tests**
  - [ ] Components, filter logic, link generation
  - [ ] Confirm coverage for new functionalities

- [ ] **Integration Tests**
  - [ ] Interaction among filters, sorting, pagination
  - [ ] Link generation + Partner Settings usage

- [ ] **End-to-End Tests**
  - [ ] Cypress scripts for navigating, toggling views, exporting links, verifying Past Events

- [ ] **Phased Rollout**
  - [ ] Phase 1: Deploy UI & Navigation changes
  - [ ] Phase 2: Deploy Filters & Sorting
  - [ ] Phase 3: Deploy Link Generator & Exports
  - [ ] Phase 4: Deploy Past Events & Final Enhancements
  - [ ] Phase 5: Deploy Advanced Features

---

**Completion Criteria**

- All items above are checked off.
- All tests (unit, integration, e2e) pass.
- Code is successfully deployed to production in phases.
