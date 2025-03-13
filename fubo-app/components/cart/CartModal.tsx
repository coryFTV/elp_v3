'use client';

import { useState } from 'react';
import { X, Download, Clipboard, Trash, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, removeFromCart, clearCart, getAffiliateLinks } = useCart();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  const affiliateLinks = getAffiliateLinks();
  
  // Function to copy links to clipboard
  const copyToClipboard = async () => {
    if (!cartItems.length) return;
    
    try {
      setIsExporting(true);
      // Format the text with title and URL on each line
      const text = affiliateLinks.map(link => `${link.title}: ${link.url}`).join('\n');
      
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
      setCopyMessage('Links copied to clipboard!');
      
      // Reset the status after 3 seconds
      setTimeout(() => {
        setCopyStatus('idle');
        setCopyMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setCopyStatus('error');
      setCopyMessage('Failed to copy links. Please try again.');
      
      // Reset the error message after 5 seconds
      setTimeout(() => {
        setCopyStatus('idle');
        setCopyMessage(null);
      }, 5000);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to download links as a CSV file
  const downloadCSV = () => {
    if (!cartItems.length) return;
    
    try {
      setIsExporting(true);
      
      // Create CSV content with proper headers
      const headers = 'Title,URL\n';
      const rows = affiliateLinks.map(link => {
        // Properly escape quotes in CSV by doubling them
        const safeTitle = link.title.replace(/"/g, '""');
        return `"${safeTitle}","${link.url}"`;
      }).join('\n');
      
      const csvContent = `${headers}${rows}`;
      
      // Create a blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'fubo_affiliate_links.csv');
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        
        // Show success message
        setCopyStatus('success');
        setCopyMessage('CSV file downloaded successfully!');
        
        // Reset message after 3 seconds
        setTimeout(() => {
          setCopyStatus('idle');
          setCopyMessage(null);
        }, 3000);
      }, 100);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setCopyStatus('error');
      setCopyMessage('Failed to download CSV. Please try again.');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setCopyStatus('idle');
        setCopyMessage(null);
      }, 5000);
      
      setIsExporting(false);
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      data-testid="cart-modal"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Cart ({cartItems.length}/5)</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="empty-cart-message">
              Your cart is empty. Add items from the Sports Schedule, Movies, or TV Series pages.
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li 
                  key={item.id} 
                  className="border rounded-md p-3 flex justify-between items-center"
                  data-testid="cart-item"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove from cart"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-4">
            {(copyStatus === 'success' || copyStatus === 'error') && (
              <Alert 
                className={
                  copyStatus === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-red-50 border-red-500 text-red-700'
                }
                role="alert"
              >
                {copyStatus === 'success' ? (
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <AlertDescription>{copyMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={downloadCSV}
                disabled={isExporting}
                className="flex items-center gap-2"
                data-testid="download-csv-btn"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              
              <Button
                onClick={copyToClipboard}
                disabled={isExporting}
                variant="outline"
                className="flex items-center gap-2"
                data-testid="copy-links-btn"
              >
                <Clipboard className="h-4 w-4" />
                Copy Links
              </Button>
              
              <Button
                onClick={clearCart}
                variant="ghost"
                className="flex items-center gap-2 ml-auto text-red-600 hover:text-red-700"
                data-testid="clear-cart-btn"
              >
                <Trash className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 