import { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle,
  Package,
  Award,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';

export default function SalesEarnings() {
  const { currentUser } = useAuth();
  const { restaurants, foods } = usePlatform();
  const { orders } = useOrders();

  const myRestId = currentUser?.restaurantId || 'rest_1';
  const restaurant = restaurants.find((r) => r.id === myRestId) || restaurants[0];

  const [dateFilter, setDateFilter] = useState('30d'); // 'today' | '7d' | '30d' | 'all'

  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === myRestId && o.status !== 'CANCELLED'),
    [orders, myRestId]
  );

  // Compute metrics based on date range
  const filteredOrders = useMemo(() => {
    const now = Date.now();
    return restaurantOrders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      const diffDays = (now - orderTime) / (1000 * 60 * 60 * 24);

      if (dateFilter === 'today') return diffDays <= 1;
      if (dateFilter === '7d') return diffDays <= 7;
      if (dateFilter === '30d') return diffDays <= 30;
      return true;
    });
  }, [restaurantOrders, dateFilter]);

  const grossSales = filteredOrders.reduce(
    (sum, o) => sum + (o.bill?.grandTotal || 0),
    0
  );

  const commissionRate = (restaurant?.commissionRate || 15) / 100;
  const platformCommissionAmount = grossSales * commissionRate;
  const netEarnings = grossSales - platformCommissionAmount;
  const avgOrderValue = filteredOrders.length > 0 ? grossSales / filteredOrders.length : 0;

  // Best selling items computed from orders
  const dishSalesMap = {};
  filteredOrders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!dishSalesMap[item.name]) {
        dishSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      dishSalesMap[item.name].quantity += item.quantity;
      dishSalesMap[item.name].revenue += item.price * item.quantity;
    });
  });

  const topDishes = Object.values(dishSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Financial Ledger
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Sales & Kitchen Earnings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track gross billings, platform commissions, and estimated net payouts
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Gross Order Value
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{Math.round(grossSales).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">Total volume from customer carts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Platform Fee (15%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            -₹{Math.round(platformCommissionAmount).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">Hosting, delivery & gateway fee</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Net Kitchen Earnings
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            ₹{Math.round(netEarnings).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">Estimated payout ready</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Avg. Order Value (AOV)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{Math.round(avgOrderValue)}
          </p>
          <p className="text-[11px] text-slate-400">
            Across {filteredOrders.length} fulfilled orders
          </p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Dishes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-[#FF6B35]" />
              Best-Selling Delicacies
            </h3>
            <span className="text-xs font-bold text-slate-400">Ranked by Gross Revenue</span>
          </div>

          {topDishes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No orders in this period.</p>
          ) : (
            <div className="space-y-3">
              {topDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B35] font-black flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{dish.name}</p>
                      <p className="text-slate-400 text-[11px]">{dish.quantity} portions ordered</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-sm">₹{dish.revenue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settlement & Payout Policy Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-600">
          <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-600" />
            Settlement & Commission Details
          </h3>

          <div className="space-y-3 leading-relaxed">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">
                FOODORA Partner Tier: Certified Kitchen
              </span>
              <span>
                Standard platform commission is capped at <span className="font-bold">15%</span> on gross billings, covering customer discovery, payment gateway fees, and logistics support.
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-800">
              <span className="font-bold block mb-0.5">Automated Weekly Payout Cycle</span>
              <span>
                In a production environment, net earnings are deposited via automated NEFT / IMPS transfer every Tuesday directly into your registered bank account.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

