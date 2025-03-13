# Fubo Affiliate Partner Home Base

A centralized platform for Fubo affiliate partners to browse content, create affiliate links, and track performance.

## 🚀 Features

- **Content Discovery**: Browse sports schedules, movies, and TV series available on Fubo
- **Affiliate Link Generation**: Add content to cart and generate customized affiliate links
- **Export Options**: Download links as CSV or copy to clipboard
- **Partner Settings**: Configure partner ID and tracking parameters
- **Responsive Design**: Works on all devices and screen sizes
- **Modern UI**: Built with Shadcn UI components

## 📋 Prerequisites

- Node.js 18.x or newer
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fubo-affiliate-partner-home.git
   cd fubo-affiliate-partner-home
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Project Structure

```
fubo-app/
├── app/                   # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── movies/            # Movies page
│   ├── partner-settings/  # Partner settings page
│   ├── sports-schedule/   # Sports schedule page
│   └── tv-series/         # TV series page
├── components/            # React components
│   ├── cart/              # Cart-related components
│   ├── Layout.tsx         # Main layout with navigation
│   ├── media/             # Media card components 
│   ├── settings/          # Settings form components
│   └── ui/                # Shadcn UI components
├── contexts/              # React contexts
│   ├── CartContext.tsx    # Cart management 
│   └── PartnerSettingsContext.tsx # Partner settings management
├── cypress/               # Cypress E2E tests
├── lib/                   # Utility functions
├── public/                # Static assets
├── services/              # Business logic services
│   └── affiliateLinkService.ts # Affiliate link generation
├── types/                 # TypeScript type definitions
└── __tests__/             # Jest tests
```

## 🧪 Testing

The project includes both unit tests with Jest and end-to-end tests with Cypress.

### Unit Tests

Run Jest tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### End-to-End Tests

Run Cypress tests in interactive mode:
```bash
npm run cypress
```

Run Cypress tests headless:
```bash
npm run cypress:headless
```

Run both development server and Cypress:
```bash
npm run e2e
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel (recommended)
- Netlify

## 📈 Future Enhancements

- Reports dashboard with affiliate performance metrics
- Authentication with role-based access
- Real-time API integration with Fubo content
- Advanced filtering and search functionality

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel/Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 