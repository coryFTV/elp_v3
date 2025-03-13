# Fubo Affiliate Partner Home Base - Developer Specification

## Overview
This project is a web-based platform serving as a centralized **home base for Fubo affiliate partners**. The platform allows users to:
- **View all live sports, movies, and TV series available on Fubo**
- **Generate and personalize Impact Radius affiliate links**
- **Filter and search content efficiently**
- **Save selected events for bulk link exports**
- **Manage partner settings for streamlined link generation**

This MVP follows **modern UI practices with Shadcn UI** and leverages **Fubo's metadata feeds & API structure**.

---
## 1. User Roles & Authentication
- **MVP Access**: No authentication; a default test user `test@fubo.tv` is used.
- **Future Plan**: Email/password authentication and SSO (Google, Impact Radius API login).
- **Partner Access**: Users manage **their own** settings and links; no visibility into others.
- **Admin Access (Future)**: Potential ability to **view analytics, manage settings for partners**.

---
## 2. UI & Navigation (Shadcn UI Integration)
### Component Framework
- Uses **Shadcn UI**, styled with **Tailwind CSS**.
- Component structure follows **modular, headless UI principles (Radix UI)**.

### Navigation Design
- **Sidebar Navigation**: Collapsible to icons.
- **Core Pages**:  
  - Full Live Sports Schedule
  - Movies
  - TV Series
  - Partner Settings (bottom left, above user info)
- **Quick Switching**: Uses **Next.js client-side routing** for seamless navigation.
- **Floating Cart Button**: Persistent; shows selected events in a pop-up.
- **Two Views for Sports Schedule**: Table view & match card grid view.

---
## 3. Link Generation & Customization
- **Default Link Type**: League URL (with option to choose Match URL or Network URL).
- **Custom Parameters**:  
  - `irmp=` (Impact Radius ID, replaceable via Partner Settings)
  - `irad=`
  - `sharedid=` (League + Match, encoded)
  - Optional: `subId1=`, `subId2=`, `subId3=`
  - UTM parameters (controlled by Fubo, toggleable)
- **Automation**:  
  - Parameters **auto-appended** to links.
  - Partner settings persist across sessions.

---
## 4. 'Add to Cart' & Bulk Export
- **Persistent Selection**: Users can add up to **5 events**.
- **Export Options**: CSV or copy to clipboard.
- **Customizable Export Fields**: Default (`League`, `Event Name`, `URL`), with checkbox options for more.
- **Real-time Preview**: Users can see link formats before exporting.
- **Bulk Export Limits**: **5 links per session**.
- **Confirmation Step**: Before exporting.

---
## 5. Filtering & Searching
- **Sticky Filter Bar**: Allows filtering by **Date, Time, Sport, Network, Team, League**.
- **Search Bar**:  
  - **Per Page Only** (not global search).
  - Searchable fields: **Title, league, network, team, sport, date**.
- **Filter Interactions**:  
  - **AND logic** (narrowing results).
  - **Auto-apply** (no need to click "Apply Filters").
- **Sorting**:  
  - Sports: **Date, Time, Sport, League, Network**.
  - Movies/TV: **Title, Release Year, Popularity**.

---
## 6. API Handling & Performance
### Data Sources
- **Primary Data Feeds**:
  - Matches JSON
  - Movies JSON
  - Series JSON
- **API Considerations**
  - `dev-api.fubo.tv` allows requests only from `*.fubo.tv` domains.
  - For local development, developers must:
    - Add `127.0.0.1 your-site.fubo.tv` to `/etc/hosts`.
    - Configure local development servers to run on `your-site.fubo.tv`.

### Performance Optimization
- **Data Fetching**: On **page load** (not lazy-loaded).
- **Manual Refresh**: No automatic updates; JSON feeds update **once daily**.
- **Impact Radius API**: Cached per session for speed.
- **Error Handling**:  
  - Pop-up messages for API failures.
  - No mock/fallback data (must have a connection).
  - **Console logging enabled** for debugging.
- **Frontend Performance**: Uses **Shadcn UI best practices**, **lazy-loading components**, and **virtualized rendering for tables**.
- **Backend Optimization**:  
  - **Temporary cache** for frequently accessed data.
  - **Server-side caching layer** (e.g., Redis).

---
## 7. Partner Settings
- **Standalone Page** (accessible via menu).
- **Save Settings Button** (no auto-save).
- **Editable Fields**:  
  - Impact Radius ID (IRMP) (defaults to a test ID if not set).
  - Default subId1, subId2, subId3 values.
  - Default preferred link type (League, Match, or Network URL).
- **Reset Option**: Users can reset settings to default.
- **Session-Based Storage**: Settings persist only **per session** (not across logins).

---
## 8. Deployment & Hosting
- **Hosting Platform**: Vercel or Netlify.
- **Backend**: Traditional setup.
- **Database**: **Supabase** for partner settings & link management.
- **Domain**: Temporary testing domain for MVP.
- **No Access Restrictions** (open testing, no whitelisting).

---
## 9. Versioning, Updates, & Maintenance
- **Version Control**: GitHub with automatic deployments via Vercel/Netlify.
- **No Staging Environment** (direct to production).
- **Update Rollout**: Continuous deployment.
- **In-App Update Log**: Users can see new feature changes.
- **Bug Reporting**:  
  - Feedback form for issue reporting.
  - Bug tracking via **GitHub Issues/Jira**.

---
## 10. Testing Plan
### Unit Testing
- **Jest** for individual components.
- Example test: Rendering a button and checking if it appears.

### Integration Testing
- **React Testing Library** to verify interactions.
- Tests for clicks and form submissions.

### End-to-End Testing
- **Cypress** for login and workflow testing.

### Accessibility Testing
- **Axe** to ensure WCAG compliance.

---
## ✅ Next Steps
- **Set up project environment following Shadcn UI guide.**
- **Implement API connections & caching strategies.**
- **Develop core components and test MVP functionality.**

