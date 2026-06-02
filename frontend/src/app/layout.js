import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AeroInventory | Enterprise Product Management System",
  description: "Manage products, inventory values, and real-time dashboard analytics with secure role-based access control.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col`}>
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 border bg-white text-slate-800 rounded-lg shadow-lg',
              duration: 4000,
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

