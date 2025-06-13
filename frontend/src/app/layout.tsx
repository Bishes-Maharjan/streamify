// app/layout.tsx
import { AuthProvider } from '@/auth/AuthProvider';
import { ReactQueryProvider } from '@/lib/react-query-provider';
import type { Metadata } from 'next';
import './globals.css';
import Providers from './root-client-layout';

export const metadata: Metadata = {
  title: 'Stream It',
  description: 'Your video and chat app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <Providers>{children}</Providers>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
