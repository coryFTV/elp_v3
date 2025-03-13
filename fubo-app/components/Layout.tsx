'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CalendarDays, 
  Film, 
  Settings, 
  User, 
  Menu, 
  X,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Fubo Partners</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/sports-schedule"
              className={`
                flex items-center p-3 rounded-lg
                ${isActive('/sports-schedule') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <CalendarDays className="w-5 h-5 mr-3" />
              <span>Sports Schedule</span>
            </Link>
            
            <Link
              href="/movies"
              className={`
                flex items-center p-3 rounded-lg
                ${isActive('/movies') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Film className="w-5 h-5 mr-3" />
              <span>Movies</span>
            </Link>
            
            <Link
              href="/tv-series"
              className={`
                flex items-center p-3 rounded-lg
                ${isActive('/tv-series') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span>TV Series</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t">
            <Link
              href="/settings"
              className={`
                flex items-center p-3 rounded-lg
                ${isActive('/settings') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Partner Settings</span>
            </Link>
            
            <div className="flex items-center p-3 mt-4">
              <User className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-gray-500">test@fubo.tv</span>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Cart button */}
        <div className="fixed bottom-6 right-6 z-20">
          <button
            className="p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-colors relative"
            aria-label="View Cart"
            onClick={() => router.push('/cart')}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {cartItems.length}
              </Badge>
            )}
          </button>
        </div>
        
        {children}
      </main>
    </div>
  );
} 