'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Layers,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/products/dashboard/analytics');
      if (response.data.success) {
        setData(response.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Could not retrieve dashboard statistics. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome skeleton */}
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        
        {/* Card grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>

        {/* Chart + Table skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-200 dark:border-red-950/40 rounded-2xl bg-red-50 dark:bg-red-950/20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Dashboard Error</h3>
        <p className="mt-1 text-sm text-red-650 dark:text-red-300 max-w-md">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-red-650 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Categories details calculation
  const totalCategoryCount = data.categoryBreakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-8">
      {/* Header welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here is a status check of your product inventory and stock details.
          </p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-slate-500" />
            Refresh
          </button>
          {isAdmin && (
            <Link
              href="/dashboard/products/create"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              Add Product
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450">Total Products</span>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 p-2.5 text-indigo-600 dark:text-indigo-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold tracking-tight">{data.totalProducts}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Items cataloged in database</p>
        </div>

        {/* Active Products */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450">Active Stock</span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{data.activeProducts}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Items currently available</p>
        </div>

        {/* Out of Stock */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450">Out of Stock</span>
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-2.5 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-450">{data.outOfStockProducts}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Critical restock required</p>
        </div>

        {/* Total Valuation */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-450">Inventory Value</span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2.5 text-amber-600 dark:text-amber-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold tracking-tight">
              ${data.totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Asset cumulative net value</p>
        </div>
      </div>

      {/* Main Charts & Statistics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category bar graph */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold">Category Distribution</h2>
            </div>
            <span className="text-xs text-slate-450">Total {totalCategoryCount} items cataloged</span>
          </div>

          <div className="mt-6 space-y-4">
            {data.categoryBreakdown.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center text-slate-400">
                <ShoppingBag className="h-10 w-10 mb-2" />
                <p className="text-sm">No products recorded. Try adding some items!</p>
              </div>
            ) : (
              data.categoryBreakdown.map((item) => {
                const percentage = totalCategoryCount > 0 ? (item.count / totalCategoryCount) * 100 : 0;
                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {item.count} items ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick actions box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 transition-all shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold">Quick Console Shortcuts</h2>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/dashboard/products" 
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 bg-slate-55/30 hover:bg-indigo-50/10 transition-all group"
              >
                <span className="text-sm font-semibold">Browse Inventory List</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {isAdmin && (
                <Link 
                  href="/dashboard/products/create" 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 bg-slate-55/30 hover:bg-indigo-50/10 transition-all group"
                >
                  <span className="text-sm font-semibold">Register New Product</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <a 
                href="http://localhost:5000/api-docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 bg-slate-55/30 hover:bg-indigo-50/10 transition-all group"
              >
                <span className="text-sm font-semibold">Swagger Documentation</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-450 text-center">
            System status: <span className="font-semibold text-emerald-500">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
