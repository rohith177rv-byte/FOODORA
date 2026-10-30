import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  Store,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export default function RestaurantDashboard() {
  const { currentUser } = useAuth();
  const { restaurants, foods, reviews } = usePlatform();
  const { orders, updateOrderStatus } = useOrders();

  const myRestId = currentUser?.restaurantId || 'rest_1';
  const restaurant = restaurants.find((r) => r.id === myRestId) || restaurants[0];

  // Orders for this restaurant
  const myOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === myRestId),
    [orders, myRestId]
  );

  // Dishes for this restaurant
  const myFoods = useMemo(
    () => foods.filter((f) => f.restaurantId === myRestId),
    [foods, myRestId]
  );

  // Reviews for this restaurant
  const myReviews = useMemo(
    () => reviews.filter((r) => r.restaurantId === myRestId),
    [reviews, myRestId]
  );

  // Analytics metrics
  const totalOrdersCount = myOrders.length;
  const activeOrders = myOrders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  );
  const completedOrders = myOrders.filter((o) => o.status === 'DELIVERED');
  const cancelledOrders = myOrders.filter((o) => o.status === 'CANCELLED');

  const totalGrossRevenue = myOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.bill?.grandTotal || 0), 0);

  const commissionRate = (restaurant?.commissionRate || 15) / 100;
  const estimatedKitchenPayout = totalGrossRevenue * (1 - commissionRate);

  // Order status distribution
  const statusCounts = {
    PLACED: myOrders.filter((o) => o.status === 'PLACED').length,
    PREPARING: myOrders.filter(
      (o) => o.status === 'PREPARING' || o.status === 'ACCEPTED'
    ).length,
    READY: myOrders.filter((o) => o.status === 'READY').length,
    DELIVERED: completedOrders.length,
    CANCELLED: cancelledOrders.length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Kitchen Overview
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            {restaurant?.name || 'Restaurant Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time orders, revenue earnings, and menu availability controls
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/restaurant/menu/add"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle size={15} />
            Add New Dish
          </Link>
          <Link
            to="/restaurant/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Clock size={15} />
            Live Orders Queue ({activeOrders.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In-Kitchen Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{activeOrders.length}</p>
          <p className="text-[11px] text-amber-600 font-bold">
            {activeOrders.length > 0 ? 'Requires chef attention' : 'All orders caught up!'}
          </p>
        </div>

        {/* Card 2: Completed Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {completedOrders.length}
          </p>
          <p className="text-[11px] text-slate-400">Total volume: {totalOrdersCount} orders</p>
        </div>

        {/* Card 3: Estimated Net Payout */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kitchen Net Payout
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            ₹{Math.round(estimatedKitchenPayout).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Gross: ₹{Math.round(totalGrossRevenue).toLocaleString()} (-15% platform fee)
          </p>
        </div>

        {/* Card 4: Customer Rating */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kitchen Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Star size={16} className="fill-current" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {restaurant?.rating || '4.8'} ★
          </p>
          <p className="text-[11px] text-slate-400">
            Based on {restaurant?.reviewCount || myReviews.length} customer ratings
          </p>
        </div>
      </div>

      {/* Two Column Layout: Charts + Live Incoming Queue */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Order Queue Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Live Kitchen Orders Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Orders requiring preparation or ready for courier pickup
                </p>
              </div>
              <Link
                to="/restaurant/orders"
                className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
              >
                View Full Queue <ChevronRight size={14} />
              </Link>
            </div>

            {activeOrders.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <p className="text-2xl mb-2">🧑‍🍳</p>
                No active pending orders right now. Switch to customer portal to place a new test order!
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-900">{order.id}</span>
                        <StatusBadge status={order.status} size="xs" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Customer: {order.customerName} • Total: ₹{order.bill.grandTotal}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {order.status === 'PLACED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                          className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Accept Order
                        </button>
                      )}
                      {order.status === 'ACCEPTED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Start Cooking
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'READY')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'READY' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Hand to Courier
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Sales Simulation Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Weekly Revenue Volume</h3>
                <p className="text-xs text-slate-400">Performance across the last 7 days</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                +14.2% vs last week
              </span>
            </div>

            {/* Simulated Bar Chart */}
            <div className="grid grid-cols-7 gap-3 pt-4 items-end h-48 text-center text-xs">
              {[
                { day: 'Mon', val: 2400, h: '45%' },
                { day: 'Tue', val: 3100, h: '60%' },
                { day: 'Wed', val: 2800, h: '55%' },
                { day: 'Thu', val: 3900, h: '75%' },
                { day: 'Fri', val: 5100, h: '95%' },
                { day: 'Sat', val: 5600, h: '100%', highlight: true },
                { day: 'Sun', val: 4700, h: '85%' },
              ].map((bar) => (
                <div key={bar.day} className="flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">₹{bar.val}</span>
                  <div
                    className={`w-full rounded-2xl transition-all duration-500 ${
                      bar.highlight
                        ? 'bg-[#FF6B35] shadow-md shadow-orange-200'
                        : 'bg-slate-200 hover:bg-orange-200'
                    }`}
                    style={{ height: bar.h }}
                  />
                  <span className="font-bold text-slate-700 text-xs">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Menu Dishes & Status Breakdown */}
        <div className="space-y-6">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              Orders Pipeline
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50/50">
                <span className="text-slate-600 font-medium">New Placed Orders</span>
                <span className="font-bold text-blue-700">{statusCounts.PLACED}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50/50">
                <span className="text-slate-600 font-medium">Cooking in Kitchen</span>
                <span className="font-bold text-amber-700">{statusCounts.PREPARING}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-purple-50/50">
                <span className="text-slate-600 font-medium">Packaged / Ready</span>
                <span className="font-bold text-purple-700">{statusCounts.READY}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-green-50/50">
                <span className="text-slate-600 font-medium">Delivered to Customers</span>
                <span className="font-bold text-green-700">{statusCounts.DELIVERED}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-red-50/50">
                <span className="text-slate-600 font-medium">Cancelled / Rejected</span>
                <span className="font-bold text-red-700">{statusCounts.CANCELLED}</span>
              </div>
            </div>
          </div>

          {/* Popular Menu Dishes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <Flame size={16} className="text-[#FF6B35]" />
                Top Menu Items
              </h3>
              <Link
                to="/restaurant/menu"
                className="text-xs font-bold text-[#FF6B35] hover:underline"
              >
                Manage ({myFoods.length})
              </Link>
            </div>

            <div className="space-y-3">
              {myFoods.slice(0, 4).map((dish) => (
                <div key={dish.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{dish.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      ₹{dish.price} • {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      dish.isAvailable !== false
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {dish.isAvailable !== false ? 'In Stock' : 'Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

