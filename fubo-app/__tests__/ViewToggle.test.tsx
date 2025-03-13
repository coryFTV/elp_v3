import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ViewToggle } from '../components/matches/ViewToggle';

describe('ViewToggle Component', () => {
  it('renders with grid view selected by default', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="grid" onViewChange={handleViewChange} />);
    
    // Check if both buttons are rendered
    const gridButton = screen.getByTestId('grid-view-button');
    const tableButton = screen.getByTestId('table-view-button');
    expect(gridButton).toBeInTheDocument();
    expect(tableButton).toBeInTheDocument();
    
    // Grid button should have the active class
    expect(gridButton).toHaveClass('bg-blue-600');
    expect(gridButton).toHaveClass('text-white');
    
    // Table button should not have the active class
    expect(tableButton).not.toHaveClass('bg-blue-600');
    expect(tableButton).toHaveClass('text-gray-700');
  });
  
  it('renders with table view selected when specified', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="table" onViewChange={handleViewChange} />);
    
    const gridButton = screen.getByTestId('grid-view-button');
    const tableButton = screen.getByTestId('table-view-button');
    
    // Table button should have the active class
    expect(tableButton).toHaveClass('bg-blue-600');
    expect(tableButton).toHaveClass('text-white');
    
    // Grid button should not have the active class
    expect(gridButton).not.toHaveClass('bg-blue-600');
    expect(gridButton).toHaveClass('text-gray-700');
  });
  
  it('calls onViewChange when clicking grid button', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="table" onViewChange={handleViewChange} />);
    
    // Click the grid button
    fireEvent.click(screen.getByTestId('grid-view-button'));
    
    // Check if onViewChange was called with 'grid'
    expect(handleViewChange).toHaveBeenCalledWith('grid');
  });
  
  it('calls onViewChange when clicking table button', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="grid" onViewChange={handleViewChange} />);
    
    // Click the table button
    fireEvent.click(screen.getByTestId('table-view-button'));
    
    // Check if onViewChange was called with 'table'
    expect(handleViewChange).toHaveBeenCalledWith('table');
  });
  
  it('does not call onViewChange when clicking the already selected view', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="grid" onViewChange={handleViewChange} />);
    
    // Click the already selected grid button
    fireEvent.click(screen.getByTestId('grid-view-button'));
    
    // onViewChange should not be called
    expect(handleViewChange).not.toHaveBeenCalled();
  });
  
  it('should have appropriate accessibility attributes', () => {
    const handleViewChange = jest.fn();
    render(<ViewToggle currentView="grid" onViewChange={handleViewChange} />);
    
    const gridButton = screen.getByTestId('grid-view-button');
    const tableButton = screen.getByTestId('table-view-button');
    
    // Check aria-pressed values
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(tableButton).toHaveAttribute('aria-pressed', 'false');
    
    // Check aria-label values
    expect(gridButton).toHaveAttribute('aria-label', 'Grid view');
    expect(tableButton).toHaveAttribute('aria-label', 'Table view');
  });
}); 