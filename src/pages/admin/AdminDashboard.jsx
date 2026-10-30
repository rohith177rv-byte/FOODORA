import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export default function AdminDashboard() {
  const { users } = useAuth();
  const { restaurants, complaints, platformSettings } = usePlatform();
  const { orders } = useOrders();

  // Platform Metrics
  const customers = useMemo(() => users.filter((u) => u.role === 'customer'), [users]);
  const activeRestaurants = useMemo(() => restaurants.filter((r) => r.status === 'ACTIVE'), [restaurants]);
  const pendingRestaurants = useMemo(() => restaurants.filter((r) => r.status === 'PENDING'), [restaurants]);
  const pendingTickets = useMemo(() => complaints.filter((c) => c.status === 'PENDING'), [complaints]);

  // Financial Metrics
  const validOrders = useMemo(() => orders.filter((o) => o.status !== 'CANCELLED'), [orders]);
  const totalGMV = useMemo(() => validOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0), [validOrders]);
  const platformCommissionRate = platformSettings.platformCommissionRate || 15;
  const platformRevenue = useMemo(() => {
    return validOrders.reduce((sum, o) => {
      const commission = ((o.itemSubtotal || 0) * platformCommissionRate) / 100;
      return sum + commission + (o.deliveryFee || 0);
    }, 0);
  }, [validOrders, platformCommissionRate]);

  // Recent 6 Orders
  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  // Days revenue simulation for chart
  const weeklyData = [
    { day: 'Mon', gmv: 3450, orders: 8 },
    { day: 'Tue', gmv: 4200, orders: 11 },
    { day: 'Wed', gmv: 3800, orders: 9 },
    { day: 'Thu', gmv: 5100, orders: 14 },
    { day: 'Fri', gmv: 6900, orders: 19 },
    { day: 'Sat', gmv: 8400, orders: 24 },
    { day: 'Sun', gmv: 9200, orders: 27 },
  ];
  const maxWeeklyGmv = Math.max(...weeklyData.map((d) => d.gmv));

  return (
    <div className="space-y-8">
      {/* Page Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Platform Operations Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time multi-vendor metrics, pending onboarding approvals, order traffic, and financial overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Commission Rate: {platformCommissionRate}%
          </span>
        </div>
      </div>

      {/* Action Alerts (Pending approvals / complaints) */}
      {(pendingRestaurants.length > 0 || pendingTickets.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingRestaurants.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    {pendingRestaurants.length} Restaurant Application{pendingRestaurants.length > 1 ? 's' : ''} Awaiting Review
                  </h4>
                  <p className="text-xs text-amber-700">Review restaurant KYC and approve kitchen onboarding.</p>
                </div>
              </div>
              <Link
                to="/admin/approvals"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
              >
                Review Now
              </Link>
            </div>
          )}

          {pendingTickets.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    {pendingTickets.length} Unresolved Support Ticket{pendingTickets.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-xs text-red-700">Customer and partner dispute complaints require review.</p>
                </div>
              </div>
              <Link
                to="/admin/feedback"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
              >
                Resolve Tickets
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Platform GMV</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{totalGMV.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across {validOrders.length} fulfilled orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FOODORA Net Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-brand-orange mt-2">
            ₹{Math.round(platformRevenue).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-2">Commission ({platformCommissionRate}%) + Delivery fees</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Restaurants</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{activeRestaurants.length}</p>
          <p className="text-xs text-gray-400 mt-2">
            {pendingRestaurants.length} pending review • {restaurants.length} total
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Users</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{customers.length}</p>
          <p className="text-xs text-gray-400 mt-2">{users.length} total platform accounts</p>
        </div>
      </div>

      {/* Weekly Revenue Graph & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bars */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Weekly GMV Volume Trend</h3>
              <p className="text-xs text-gray-500">Daily gross merchandise value across all kitchens</p>
            </div>
            <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full">
              Past 7 Days
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-gray-100 pb-2">
            {weeklyData.map((d) => {
              const heightPercent = Math.round((d.gmv / maxWeeklyGmv) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold py-1 px-1.5 rounded pointer-events-none whitespace-nowrap shadow">
                    ₹{d.gmv} ({d.orders} orders)
                  </div>
                  <div className="w-full bg-orange-100 rounded-t-md hover:bg-brand-orange transition-colors relative flex items-end justify-center" style={{ height: `${heightPercent}%` }}>
                    <div className="w-full bg-brand-orange rounded-t-md" style={{ height: '70%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Health Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-base">Platform Ecosystem</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
              <span className="font-semibold text-gray-600">Total Live Food Dishes</span>
              <span className="font-black text-gray-900">26</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
              <span className="font-semibold text-gray-600">Standard Delivery Fee</span>
              <span className="font-black text-gray-900">₹{platformSettings.deliveryFee || 30}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
              <span className="font-semibold text-gray-600">Free Delivery Cutoff</span>
              <span className="font-black text-gray-900">₹{platformSettings.freeDeliveryThreshold || 299}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
              <span className="font-semibold text-gray-600">Platform Tax Rate</span>
              <span className="font-black text-gray-900">{(platformSettings.taxRate || 0.05) * 100}% GST</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/settings"
              className="w-full block text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
            >
              Configure Platform Rates
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Recent Platform Orders</h3>
            <p className="text-xs text-gray-500">Live order stream across all participating restaurants</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-brand-orange">{order.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{order.restaurantName}</td>
                  <td className="px-4 py-3 text-gray-500">{order.items?.length || 0} items</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{order.grandTotal}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

