import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { AuthProvider } from '@/components/layout/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'MO Marketplace',
    template: '%s · MO Marketplace',
  },
  description:
    'A curated marketplace for premium products. Discover, compare, and buy with confidence.',
  keywords: ['marketplace', 'products', 'ecommerce'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink text-chalk font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1C1C28',
                border: '1px solid #2A2A3A',
                color: '#F5F4EF',
                fontFamily: 'var(--font-syne)',
                fontSize: '14px',
              },
              classNames: {
                success:
                  'border-[rgba(201,168,76,0.4)] !text-[#E4C97A]',
                error: 'border-[rgba(255,59,59,0.4)]',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
