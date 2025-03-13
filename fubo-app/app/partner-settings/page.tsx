import { Metadata } from 'next';
import { Suspense } from 'react';
import PartnerSettingsForm from '@/components/settings/PartnerSettingsForm';
import { PartnerSettingsProvider } from '@/contexts/PartnerSettingsContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SettingsErrorMessage from '@/components/settings/SettingsErrorMessage';
import SettingsLoadingSkeleton from '@/components/settings/SettingsLoadingSkeleton';
import { Layout } from '@/components/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Partner Settings | Fubo Affiliate',
  description: 'Configure your partner settings for generating affiliate links',
  openGraph: {
    title: 'Partner Settings | Fubo Affiliate',
    description: 'Configure your partner settings for generating affiliate links',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PartnerSettings() {
  return (
    <Layout>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="settings-heading">
        <section className="max-w-3xl mx-auto flex flex-col gap-6">
          <Breadcrumb 
            items={[
              { label: 'Partner Settings', href: '/partner-settings', isCurrent: true }
            ]}
            data-testid="settings-breadcrumb"
          />
          
          <header>
            <h1 id="settings-heading" className="text-2xl md:text-3xl font-bold mb-1">Partner Settings</h1>
            <p className="text-gray-600">Configure your settings for generating affiliate links.</p>
          </header>
          
          <ErrorBoundary fallback={<SettingsErrorMessage />}>
            <Suspense fallback={<SettingsLoadingSkeleton />}>
              <PartnerSettingsProvider>
                <PartnerSettingsForm />
              </PartnerSettingsProvider>
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </Layout>
  );
} 