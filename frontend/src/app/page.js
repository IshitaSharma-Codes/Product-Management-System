'use client';

import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { ShieldCheck, BarChart3, Database, Code2, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#060913] transition-colors duration-500 overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center relative">
        
        {/* Glow meshes background */}
        <div className="absolute top-0 left-1/4 -z-10 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/15 animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[120px] dark:bg-violet-500/10 animate-glow" />

        <div className="relative px-6 pt-20 pb-16 lg:px-8 max-w-7xl mx-auto">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            
            {/* Pulsing Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-400/20 backdrop-blur-md mx-auto animate-bounce-slow">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Next-Gen Inventory Control Console</span>
            </div>
            
            {/* Title with Gradient Text */}
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-7xl">
              Precision Product Management{' '}
              <span className="block mt-2 bg-gradient-to-r from-indigo-650 via-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">
                Built for Enterprise Scale.
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-650 dark:text-slate-400">
              Control listings, track asset values, and deploy role-based security in one centralized operations interface. Clean, fast, and secure.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Launch App Console
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-350 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Architecture Features</span>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              High Performance Specifications
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4 sm:grid-cols-2">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-[#0d1222]/80 border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-300 group glow-card">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-600 dark:text-indigo-450 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <dt className="mt-5 font-bold text-slate-900 dark:text-white text-base">RBAC Shield Security</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                  Dual-tier access check validating JWT access signatures and locking operations strictly behind Admin gates.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-[#0d1222]/80 border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-300 group glow-card">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-600 dark:text-indigo-450 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <dt className="mt-5 font-bold text-slate-900 dark:text-white text-base">Visual Intelligence</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                  Dynamic visual indicators aggregating catalog assets count, critical stock warnings, and inventory values.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-[#0d1222]/80 border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-300 group glow-card">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-600 dark:text-indigo-450 group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6" />
                </div>
                <dt className="mt-5 font-bold text-slate-900 dark:text-white text-base">Memory Caching</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                  Optimized lookup query response times via integrated Redis Caching with direct failproof Mongo DB fallbacks.
                </dd>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-[#0d1222]/80 border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-300 group glow-card">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-600 dark:text-indigo-450 group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6" />
                </div>
                <dt className="mt-5 font-bold text-slate-900 dark:text-white text-base">Developer Portal</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                  Swagger UI interface mapped at `/api-docs` defining request, response schemas, and error parameters.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
