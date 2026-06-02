'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import API from '@/services/api';
import { ArrowLeft, Loader2, Upload, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
  price: z.preprocess((val) => parseFloat(val), z.number().positive('Price must be a positive number')),
  stock: z.preprocess((val) => parseInt(val, 10), z.number().int().nonnegative('Stock count must be a non-negative integer')),
  category: z.string().trim().min(2, 'Category is required'),
  image: z.string().optional(),
});

export default function EditProduct({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fetchError, setFetchError] = useState('');

  const categoriesList = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Automotive', 'Toys', 'Other'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const watchImage = watch('image');

  // Verify User is Admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Unauthorized. Admins only.');
      router.push('/dashboard');
    }
  }, [isAdmin, authLoading, router]);

  // Load Product Data
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setFetching(true);
      setFetchError('');
      try {
        const response = await API.get(`/products/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image || '',
          });
        }
      } catch (err) {
        console.error(err);
        setFetchError('Failed to fetch product details. Item may have been deleted.');
      } finally {
        setFetching(false);
      }
    };

    if (isAdmin) {
      fetchProductDetails();
    }
  }, [id, reset, isAdmin]);

  // Sync image preview URL
  useEffect(() => {
    if (watchImage) {
      if (watchImage.startsWith('http') || watchImage.startsWith('/uploads')) {
        setImagePreview(watchImage.startsWith('/uploads') ? `http://localhost:5000${watchImage}` : watchImage);
      } else {
        setImagePreview('');
      }
    } else {
      setImagePreview('');
    }
  }, [watchImage]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size cannot exceed 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await API.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setValue('image', response.data.imageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await API.put(`/products/${id}`, data);
      if (response.data.success) {
        toast.success(response.data.message || 'Product updated successfully!');
        router.push('/dashboard/products');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Could not update product.';
      const backendErrors = err.response?.data?.errors;
      
      if (backendErrors && backendErrors.length > 0) {
        backendErrors.forEach(be => toast.error(`${be.field}: ${be.message}`));
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            {fetching ? 'Fetching product info...' : 'Verifying permissions...'}
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-200 dark:border-red-950/40 rounded-2xl bg-red-50 dark:bg-red-950/20 text-center py-16">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Loading Error</h3>
        <p className="mt-1 text-sm text-red-650 dark:text-red-300 max-w-sm">{fetchError}</p>
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Edit Product</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update product catalog specifications.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl transition-all duration-300">
        <div className="grid gap-6 sm:grid-cols-2">
          
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Product Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-3 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              {...register('category')}
              className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-3 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            >
              <option value="">Select Category</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Price ($)
            </label>
            <input
              {...register('price')}
              type="number"
              step="0.01"
              className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-3 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Stock Quantity
            </label>
            <input
              {...register('stock')}
              type="number"
              className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-3 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-3 px-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Product Image
            </label>
            
            <div className="grid gap-4 md:grid-cols-2">
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 dark:border-slate-800 bg-slate-55/10 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                <input
                  type="file"
                  id="image-file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                  disabled={uploading}
                />
                <label 
                  htmlFor="image-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 text-center"
                >
                  <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-3 text-indigo-600 dark:text-indigo-400">
                    {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Upload New Image</p>
                    <p className="text-xs text-slate-450 mt-1">JPEG, PNG, WEBP up to 5MB</p>
                  </div>
                </label>
              </div>

              <div className="flex flex-col justify-center border border-slate-200 rounded-2xl p-6 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <LinkIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold">Modify image URL</span>
                </div>
                <input
                  {...register('image')}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-55/30 py-2.5 px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                />
              </div>

            </div>

            {imagePreview && (
              <div className="flex items-center space-x-4 rounded-xl border border-slate-200 bg-slate-55/20 p-4 dark:border-slate-800">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      setImagePreview('');
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Selected URL / Path</p>
                  <p className="text-sm font-medium truncate max-w-xs md:max-w-md mt-0.5">{watchImage}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="flex justify-end space-x-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-98"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
