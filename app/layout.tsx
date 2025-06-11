import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/shared/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Modern admin dashboard for business management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <main className="lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}