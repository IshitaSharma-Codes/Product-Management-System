'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Loader2,
  Plus,
  ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductListing() {
  const { isAdmin } = useAuth();
  
  // Products states
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [stockStatus, setStockStatus] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Deletion modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Static/dynamic Categories list to populate filter dropdowns
  const categoriesList = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Automotive', 'Toys', 'Other'];

  const fetchProducts = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: targetPage,
        limit: pagination.limit,
        sort,
      });

      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (stockStatus) queryParams.append('stockStatus', stockStatus);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);

      const response = await API.get(`/products?${queryParams.toString()}`);
      if (response.data.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products list');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, sort, search, category, stockStatus, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 300); // Debounce input queries
    return () => clearTimeout(timer);
  }, [search, category, sort, stockStatus, minPrice, maxPrice, fetchProducts]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await API.delete(`/products/${deleteId}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Product deleted successfully!');
        setDeleteId(null);
        // Refresh catalog list
        fetchProducts(pagination.page);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while deleting product.');
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('-createdAt');
    setStockStatus('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products Inventory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse and query products details.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/products/create"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Register Product
          </Link>
        )}
      </div>

      {/* Query Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search catalog items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
        <div className="flex space-x-3 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              showFilters || category || stockStatus || minPrice || maxPrice
                ? 'border-indigo-500 bg-indigo-50/20 text-indigo-600 dark:border-indigo-500/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                : 'border-slate-200 bg-white hover:bg-slate-55 dark:border-slate-850 dark:bg-slate-900 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </button>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold dark:border-slate-850 dark:bg-slate-900 focus:outline-none"
          >
            <option value="-createdAt">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Expanded filters sidebar */}
      {(showFilters || category || stockStatus || minPrice || maxPrice) && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-slate-900 space-y-4 shadow-inner">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock status selection */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="">All Stock Levels</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out Of Stock</option>
              </select>
            </div>

            {/* Minimum Price */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Min Price ($)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            {/* Maximum Price */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Max Price ($)</label>
              <input
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

          </div>
        </div>
      )}

      {/* Products Grid Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 h-96 dark:border-slate-850 dark:bg-slate-900" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-250 dark:border-slate-850 rounded-3xl bg-white dark:bg-slate-900 text-center py-20">
          <ShoppingBag className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold">No Products Found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            We couldn&apos;t find any items matching your selected criteria. Try adjusting filters or keyword searches.
          </p>
          {isAdmin && (
            <Link
              href="/dashboard/products/create"
              className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Add first product
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => {
              const inStock = prod.stock > 0;
              // Format absolute image url
              const imageSrc = prod.image?.startsWith('http') 
                ? prod.image 
                : prod.image 
                  ? `http://localhost:5000${prod.image}` 
                  : '/uploads/default-product.png';
              
              return (
                <div
                  key={prod._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-700"
                >
                  
                  {/* Image banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop';
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-350"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-extrabold uppercase text-white tracking-wider backdrop-blur-sm">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        inStock 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {inStock ? `${prod.stock} in stock` : 'Out of stock'}
                      </span>
                      <span className="text-xl font-bold text-slate-950 dark:text-white">
                        ${prod.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold truncate tracking-tight mb-2 group-hover:text-indigo-500 transition-colors">
                      {prod.name}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                    <Link
                      href={`/dashboard/products/${prod._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          href={`/dashboard/products/edit/${prod._id}`}
                          className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-500 dark:border-slate-800 dark:hover:text-indigo-400 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => setDeleteId(prod._id)}
                          className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-500 dark:border-slate-800 dark:hover:text-rose-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination control bar */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Showing page <span className="font-semibold">{pagination.page}</span> of{' '}
                <span className="font-semibold">{pagination.pages}</span> ({pagination.total} products)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchProducts(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-850 dark:bg-slate-900"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  Prev
                </button>
                <button
                  onClick={() => fetchProducts(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-850 dark:bg-slate-900"
                >
                  Next
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Deletion Warning Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-900 shadow-2xl animate-in scale-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold">Remove Product</h3>
              <p className="mt-2 text-xs text-slate-550 dark:text-slate-400">
                Are you sure you want to delete this product? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-grow rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-55 dark:border-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-grow inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
