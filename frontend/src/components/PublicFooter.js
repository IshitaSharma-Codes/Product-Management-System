export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} AeroInventory. Built for scale, security, and velocity. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="text-xs text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">Privacy Policy</a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <a href="#" className="text-xs text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">Terms of Service</a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <a href="/api-docs" target="_blank" className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">Swagger API Docs</a>
        </div>
      </div>
    </footer>
  );
}
