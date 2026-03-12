import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppDataProvider } from '@/hooks/use-app-data';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

export const metadata: Metadata = {
  title: 'Трекер привычек',
  description: 'Личный трекер привычек с офлайн-режимом для iPhone.',
  applicationName: 'Трекер привычек',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  appleWebApp: {
    capable: true,
    title: 'Трекер привычек',
    statusBarStyle: 'black-translucent'
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#121522' }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <AppDataProvider>
          <ServiceWorkerRegister />
          {children}
        </AppDataProvider>
      </body>
    </html>
  );
}
