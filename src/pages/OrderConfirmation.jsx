import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, MapPin, User, Phone, ShoppingBag, ListOrdered } from 'lucide-react';
import { getOrderById } from '../services/orderService.js';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-[#FF6B35]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🤔</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">We couldn't find an order with ID: {orderId}</p>
          <Link to="/" className="text-[#FF6B35] font-semibold hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={48} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Your Order Has Been Confirmed!
          </h1>
          <p className="text-gray-500">Thank you for ordering with FOODORA. Your meal is being prepared!</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
              <p className="text-xl font-extrabold text-[#FF6B35] font-mono">{order.id}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {order.status || 'Confirmed'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B35] shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Order Date & Time</p>
                <p className="text-sm font-semibold text-gray-800">
                  {orderDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  at{' '}
                  {orderDate.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B35] shrink-0">
                <Package size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Estimated Delivery Time</p>
                <p className="text-sm font-semibold text-gray-800">{order.estimatedPrepTime || '25-30 min'}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="py-5 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Customer & Delivery Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2.5 text-gray-700">
                <User size={15} className="text-[#FF6B35] shrink-0" />
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <Phone size={15} className="text-[#FF6B35] shrink-0" />
                <span>+91 {order.mobile}</span>
              </div>
              <div className="flex items-start gap-2.5 text-gray-700">
                <MapPin size={15} className="text-[#FF6B35] mt-0.5 shrink-0" />
                <span>{order.address}</span>
              </div>
              {order.instructions && (
                <div className="text-xs text-gray-500 bg-orange-50/50 p-2.5 rounded-xl mt-2">
                  <span className="font-semibold text-gray-700">Note:</span> {order.instructions}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="pt-5">
            <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Ordered Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                    <span className="text-gray-700 font-medium">
                      {item.name} <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{order.bill.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className={order.bill.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.bill.deliveryFee === 0 ? 'FREE' : `₹${order.bill.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes</span>
                <span>₹{order.bill.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-xl text-[#FF6B35]">₹{order.bill.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-200"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#FF6B35] border-2 border-[#FF6B35] py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-all"
          >
            <ListOrdered size={18} />
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

