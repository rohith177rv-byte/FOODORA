import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { getOrders } from '../services/orderService.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-[#FF6B35]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package size={40} className="text-[#FF6B35]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders placed yet</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Explore our curated menu and place your first delicious order today!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
          >
            <ShoppingBag size={18} />
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Order History</h1>
          <p className="text-white/80">Track and review all your previous FOODORA orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt);
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(order.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-orange-50/20 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-[#FF6B35] text-base">{order.id}</span>
                      <span className="px-3 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {order.status || 'Confirmed'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        {date.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        at{' '}
                        {date.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item
                        {order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-gray-900">₹{order.bill.grandTotal}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-500">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 pt-4 bg-gray-50/30 animate-fadeIn">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Delivery Address</h4>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <MapPin size={14} className="text-[#FF6B35] mt-0.5 shrink-0" />
                        <span>{order.address}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Items Breakdown</h4>
                    <div className="space-y-2 mb-4 bg-white p-4 rounded-xl border border-gray-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.name} <span className="text-gray-400">× {item.quantity}</span>
                          </span>
                          <span className="font-medium text-gray-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 text-sm gap-2">
                      <div className="text-xs text-gray-500">
                        Estimated prep time: <span className="font-semibold text-gray-700">{order.estimatedPrepTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Grand Total:</span>
                        <span className="text-lg font-bold text-[#FF6B35]">₹{order.bill.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

