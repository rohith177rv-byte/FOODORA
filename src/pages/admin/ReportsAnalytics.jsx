import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Store,
  Calendar,
  UtensilsCrossed,
  Download,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function ReportsAnalytics() {
  const { orders } = useOrders();
  const { restaurants, foods, platformSettings } = usePlatform();
  const { showToast } = useCart();

  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | 'all'

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status !== 'CANCELLED'),
    [orders]
  );

  const totalGMV = useMemo(
    () => completedOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0),
    [completedOrders]
  );

  const avgOrderValue = useMemo(() => {
    if (completedOrders.length === 0) return 0;
    return Math.round(totalGMV / completedOrders.length);
  }, [completedOrders, totalGMV]);

  const commissionRate = platformSettings.platformCommissionRate || 15;
  const platformRevenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => {
      const comm = ((o.itemSubtotal || 0) * commissionRate) / 100;
      return sum + comm + (o.deliveryFee || 0);
    }, 0);
  }, [completedOrders, commissionRate]);

  // Cuisine popularity
  const cuisineBreakdown = useMemo(() => {
    const counts = {};
    foods.forEach((f) => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    const total = foods.length || 1;
    return Object.entries(counts).map(([cuisine, count]) => ({
      cuisine,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [foods]);

  // Top restaurants by order volume
  const topRestaurants = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      counts[o.restaurantName] = (counts[o.restaurantName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, orderCount]) => ({ name, orderCount }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  }, [orders]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order ID,Restaurant,Customer,Amount,Status,Date']
        .concat(
          orders.map(
            (o) =>
              `${o.id},"${o.restaurantName}","${o.customerName}",${o.grandTotal},${o.status},${o.createdAt}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foodora_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.('Analytics report exported as CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Financial performance, GMV run-rate, commission accruals, and cuisine popularity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-brand-orange"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Gross Merchandise Value</span>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{totalGMV.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Fulfilled across all kitchens</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Net Platform Commission</span>
          <p className="text-2xl font-black text-brand-orange mt-2">
            ₹{Math.round(platformRevenue).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{commissionRate}% cut + delivery revenue</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Average Order Value (AOV)</span>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{avgOrderValue}</p>
          <p className="text-xs text-gray-400 mt-1">Per transaction average</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Orders</span>
          <p className="text-2xl font-black text-gray-900 mt-2">{orders.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {orders.filter((o) => o.status === 'DELIVERED').length} delivered •{' '}
            {orders.filter((o) => o.status === 'CANCELLED').length} cancelled
          </p>
        </div>
      </div>

      {/* Grid: Cuisine Distribution & Top Restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuisine Popularity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Food Menu Category Share</h3>
          <p className="text-xs text-gray-500">Dish distribution across active kitchen menus</p>

          <div className="space-y-3 pt-2">
            {cuisineBreakdown.map((item) => (
              <div key={item.cuisine} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>{item.cuisine}</span>
                  <span>{item.count} items ({item.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Top Performing Kitchens</h3>
          <p className="text-xs text-gray-500">Highest volume restaurant partners</p>

          <div className="space-y-3 pt-2">
            {topRestaurants.map((rest, index) => (
              <div
                key={rest.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-brand-orange text-xs font-black flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{rest.name}</span>
                </div>
                <span className="text-xs font-extrabold text-brand-orange">
                  {rest.orderCount} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

