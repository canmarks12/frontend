import { Navbar } from '@/components/shared/Navbar';
import { CardStat } from '@/components/shared/CardStat';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total PreOrders',
      value: '2,847',
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: 'Total Operasional Expenses',
      value: 'Rp 45,231,000',
      change: '+4% from last month',
      changeType: 'negative' as const,
      icon: DollarSign,
    },
    {
      title: 'Total Materials',
      value: '1,429',
      change: '+8% from last month',
      changeType: 'positive' as const,
      icon: Package,
    },
  ];

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <CardStat
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Recent Activity Card */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New PreOrder Created</p>
                  <p className="text-xs text-muted-foreground">PO-2024-001 • 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Surat Jalan Updated</p>
                  <p className="text-xs text-muted-foreground">SJ-2024-025 • 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Operasional Expense Added</p>
                  <p className="text-xs text-muted-foreground">Rp 2,500,000 • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending PreOrders</span>
                <span className="text-sm font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Surat Jalan</span>
                <span className="text-sm font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month Expenses</span>
                <span className="text-sm font-medium">Rp 12,450,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low Stock Materials</span>
                <span className="text-sm font-medium text-orange-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}