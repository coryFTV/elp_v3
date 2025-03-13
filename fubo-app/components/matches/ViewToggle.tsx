'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

export type ViewType = 'grid' | 'table';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const isGridActive = currentView === 'grid';
  const isTableActive = currentView === 'table';
  
  const handleGridClick = () => {
    if (!isGridActive) {
      onViewChange('grid');
    }
  };
  
  const handleTableClick = () => {
    if (!isTableActive) {
      onViewChange('table');
    }
  };
  
  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-testid="view-toggle">
      <Button
        type="button"
        variant="ghost"
        className={`flex items-center gap-2 py-2 px-3 rounded-none ${
          isGridActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
        }`}
        onClick={handleGridClick}
        aria-pressed={isGridActive}
        aria-label="Grid view"
        data-testid="grid-view-button"
      >
        <Grid size={16} />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      
      <div className="w-px bg-gray-200"></div>
      
      <Button
        type="button"
        variant="ghost"
        className={`flex items-center gap-2 py-2 px-3 rounded-none ${
          isTableActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
        }`}
        onClick={handleTableClick}
        aria-pressed={isTableActive}
        aria-label="Table view"
        data-testid="table-view-button"
      >
        <List size={16} />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  );
} 