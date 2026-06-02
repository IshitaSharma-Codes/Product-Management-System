'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Analytics Console', href: '/dashboard', icon: LayoutDashboard, role: 'all' },
    { name: 'Products Inventory', href: '/dashboard/products', icon: Package, role: 'all' },
    { name: 'Register Product', href: '/dashboard/products/create', icon: PlusCircle, role: 'admin' },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.role === 'all' || (item.role === 'admin' && isAdmin)
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
      
      {/* Brand logo header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
            <Package className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">
            AeroInventory
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-grow space-y-1 px-4 py-6">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-800/40 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer profile summary */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4">
        <div className="flex items-center space-x-3 px-2 py-1.5 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-xs font-semibold text-slate-850 dark:text-white truncate">{user.name}</p>
            <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
              isAdmin 
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-slate-900 transition-transform duration-350 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Main App Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-4 md:px-8 dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-md transition-colors duration-300 shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
              <span className="font-semibold text-slate-500 dark:text-slate-350">Console</span>
              <span>/</span>
              <span className="capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 focus:outline-none">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
