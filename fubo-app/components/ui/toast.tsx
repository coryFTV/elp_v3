'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number; // in milliseconds
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow time for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);
  
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-md transition-all',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        {
          'bg-white border-gray-200': variant === 'default',
          'bg-green-50 border-green-200': variant === 'success',
          'bg-red-50 border-red-200': variant === 'error',
          'bg-yellow-50 border-yellow-200': variant === 'warning',
        }
      )}
      role="alert"
      data-testid="toast"
    >
      <div className="flex flex-col gap-1">
        <div className={cn('text-sm font-medium', {
          'text-gray-900': variant === 'default',
          'text-green-800': variant === 'success',
          'text-red-800': variant === 'error',
          'text-yellow-800': variant === 'warning',
        })}>
          {title}
        </div>
        {description && (
          <div className={cn('text-xs', {
            'text-gray-500': variant === 'default',
            'text-green-700': variant === 'success',
            'text-red-700': variant === 'error',
            'text-yellow-700': variant === 'warning',
          })}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className={cn('shrink-0 rounded-md p-1', {
          'text-gray-400 hover:text-gray-500': variant === 'default',
          'text-green-500 hover:text-green-600': variant === 'success',
          'text-red-500 hover:text-red-600': variant === 'error',
          'text-yellow-500 hover:text-yellow-600': variant === 'warning',
        })}
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
} 