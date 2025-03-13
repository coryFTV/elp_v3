import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { PartnerSettingsProvider } from '@/contexts/PartnerSettingsContext';
import { ToastProvider } from '@/contexts/ToastContext';

// Note: The Layout component is imported but not used in the RootLayout to avoid client/server
// rendering conflicts. Instead, we'll apply it at the page level.
import { Layout } from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fubo Affiliate Hub',
  description: 'A centralized platform for Fubo affiliate partners',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <PartnerSettingsProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PartnerSettingsProvider>
        </CartProvider>
      </body>
    </html>
  );
} 