import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppDataProvider } from '@/hooks/use-app-data';

export const metadata: Metadata = {
  title: 'Никах Ильнура и Камиллы',
  description: 'Приглашение на никах Ильнура и Камиллы 05 июня 2026 года в Казани.',
  applicationName: 'Никах Ильнур и Камилла',
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
    title: 'Никах Ильнур и Камилла',
    statusBarStyle: 'default'
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
  viewportFit: 'cover',
  themeColor: '#efe4d7'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <AppDataProvider>
          {children}
        </AppDataProvider>
      </body>
    </html>
  );
}
