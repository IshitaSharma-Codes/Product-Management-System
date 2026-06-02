'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  User,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const { isAdmin } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProductDetails = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve product information. Item might not exist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      const response = await API.delete(`/products/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Product deleted successfully!');
        router.push('/dashboard/products');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error deleting product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading product specs...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-200 dark:border-red-950/40 rounded-2xl bg-red-50 dark:bg-red-950/20 text-center py-16 max-w-md mx-auto">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Loading Error</h3>
        <p className="mt-1 text-sm text-red-650 dark:text-red-300">{error || 'Item details missing'}</p>
        <Link
          href="/dashboard/products"
          className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const imageSrc = product.image?.startsWith('http') 
    ? product.image 
    : product.image 
      ? `http://localhost:5000${product.image}` 
      : '/uploads/default-product.png';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header breadcrumb bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-55 dark:border-slate-800 dark:bg-slate-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Inventory</span>
        </Link>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Link
              href={`/dashboard/products/edit/${product._id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              <Edit2 className="h-4 w-4" />
              Edit Specs
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-105 hover:text-rose-800 dark:border-rose-950/40 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
              Remove Item
            </button>
          </div>
        )}
      </div>

      {/* Main product display panels */}
      <div className="grid gap-8 md:grid-cols-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-300">
        
        {/* Left Column: Image wrapper */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover max-h-[500px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-slate-900/90 px-3.5 py-1 text-xs font-bold uppercase text-white tracking-widest backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Column: Spec details details */}
        <div className="flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                inStock 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450'
              }`}>
                <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {inStock ? `${product.stock} units available` : 'Out of stock'}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Price tag */}
            <div className="flex items-center gap-1.5 text-3xl font-black text-slate-950 dark:text-white">
              <DollarSign className="h-7 w-7 text-indigo-500 shrink-0" />
              <span>{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Description text */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Audit trail metadata */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
            
            <div className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span>
                Cataloged by: <span className="font-semibold text-slate-800 dark:text-slate-200">{product.createdBy?.name || 'System Admin'}</span> ({product.createdBy?.email || 'admin@system.com'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span>
                Created: <span className="font-semibold">{new Date(product.createdAt).toLocaleString()}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span>
                Last Modified: <span className="font-semibold">{new Date(product.updatedAt).toLocaleString()}</span>
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
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
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-grow rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-55 dark:border-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
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
