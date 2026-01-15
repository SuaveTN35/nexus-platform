import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'AEQUALIS Platform - AI-Native Business Intelligence',
  description: 'Next-generation all-in-one business management platform with AI-native architecture',
  openGraph: {
    title: 'AEQUALIS Platform - AI-Native Business Intelligence',
    description: 'Next-generation all-in-one business management platform with AI-native architecture',
    type: 'website',
    siteName: 'AEQUALIS Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEQUALIS Platform - AI-Native Business Intelligence',
    description: 'Next-generation all-in-one business management platform with AI-native architecture',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AppProvider>
            <ToastProvider>{children}</ToastProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
