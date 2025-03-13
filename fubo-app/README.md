# Fubo Affiliate Partner Home Base

A centralized platform for Fubo affiliate partners to browse content and generate customized affiliate links.

## Features

- **Content Browse & Search:** View all live sports, movies, and TV series available on Fubo
- **Link Generation:** Create and personalize Impact Radius affiliate links
- **Advanced Filtering:** Filter content by date, time, sport, network, team, and league
- **Bulk Export:** Save up to 5 events for bulk link export (CSV or clipboard)
- **Partner Settings:** Configure your Impact Radius IDs and default parameters

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **UI Components:** Shadcn UI (built on Radix UI)
- **Styling:** Tailwind CSS
- **Testing:** Jest, React Testing Library, Cypress
- **Type Safety:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Local domain setup for API access
  - Add `127.0.0.1 your-site.fubo.tv` to your `/etc/hosts` file
  - Configure your local development server to run on `your-site.fubo.tv`

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fubo-affiliate-hub.git
cd fubo-affiliate-hub
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://your-site.fubo.tv:3000](http://your-site.fubo.tv:3000) in your browser

## Project Structure

```
fubo-affiliate-hub/
├── app/                    # Next.js 14 App Router
│   ├── movies/             # Movies browsing page
│   ├── sports-schedule/    # Live sports schedule page
│   ├── tv-series/          # TV Series browsing page
│   ├── partner-settings/   # Partner configuration page
│   └── layout.tsx          # Root layout with sidebar navigation
├── components/             # Reusable components
│   ├── cart/               # Cart components for bulk export
│   ├── media/              # Media browsing components
│   ├── filters/            # Filter components
│   └── ui/                 # UI components from Shadcn
├── services/               # API services
│   ├── moviesService.ts    # Movie data service
│   ├── seriesService.ts    # TV Series data service
│   ├── sportsService.ts    # Sports data service
│   └── linkService.ts      # Link generation service
├── types/                  # TypeScript interfaces
├── public/                 # Static assets
├── __tests__/              # Test files
├── cypress/                # End-to-end tests
└── lib/                    # Utility functions
```

## Link Generation

The platform automatically generates affiliate links with the following parameters:
- `irmp=` (Impact Radius ID, configurable in Partner Settings)
- `irad=`
- `sharedid=` (League + Match, encoded)
- Optional: `subId1=`, `subId2=`, `subId3=` (configurable)
- UTM parameters (toggleable)

## Testing

Run unit and integration tests with:

```bash
npm test
# or
yarn test
```

Run tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```

Run end-to-end tests with:

```bash
npm run e2e
# or
yarn e2e
```

## Deployment

The app can be deployed to Vercel or Netlify with a simple push to the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 