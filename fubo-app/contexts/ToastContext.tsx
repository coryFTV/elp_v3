'use client';

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { Toast, ToastProps } from '@/components/ui/toast';
import { createPortal } from 'react-dom';

type ToastType = Omit<ToastProps, 'onClose' | 'id'> & { id?: string };

interface ToastContextValue {
  showToast: (toast: ToastType) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Set up portal container when component mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let container = document.getElementById('toast-portal');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-portal';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
      }
      setPortalContainer(container);
    }
  }, []);

  const showToast = useCallback((toast: ToastType) => {
    const id = toast.id || Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, onClose: dismissToast }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {portalContainer &&
        createPortal(
          toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          )),
          portalContainer
        )}
    </ToastContext.Provider>
  );
} 