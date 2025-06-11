'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  FileText,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Operasional',
    href: '/operasional',
    icon: DollarSign,
  },
  {
    title: 'PreOrder',
    href: '/preorder',
    icon: ShoppingCart,
  },
  {
    title: 'Surat Jalan',
    href: '/surat-jalan',
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-30 h-full w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}