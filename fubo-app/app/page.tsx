import React from 'react';
import { Layout } from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to Fubo Affiliate Hub
          </h1>
          <p className="text-center mb-4">
            A centralized platform for Fubo affiliate partners
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="border rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Sports Schedule</h2>
              <p>Browse upcoming sports events and create affiliate links</p>
            </div>
            <div className="border rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Movies & TV Series</h2>
              <p>Discover content and generate revenue with affiliate links</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 