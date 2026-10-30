import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  User,
  Phone,
  ShoppingBag,
  ListOrdered,
  Navigation,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext.jsx';
import { getOrderById as getLegacyOrderById } from '../services/orderService.js';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Try OrderContext first
      const ctxOrder = getOrderById(orderId);
      if (ctxOrder) {
        setOrder(ctxOrder);
        setLoading(false);
        return;
      }

      // Fallback to legacy service
      const legacy = await getLegacyOrderById(orderId);
      setOrder(legacy);
      setLoading(false);
    }
    load();
  }, [orderId, getOrderById]);

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
          <Link to="/" className="text-[#FF6B35] font-semibold hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt || '2026-10-30T12:00:00Z');
  const bill = order.bill || {
    itemSubtotal: order.itemSubtotal || 0,
    deliveryFee: order.deliveryFee || 0,
    tax: order.tax || 0,
    discount: order.discount || 0,
    grandTotal: order.grandTotal || 0,
  };

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
          <p className="text-gray-500">
            Thank you for ordering with FOODORA. Your meal from{' '}
            <strong className="text-gray-800">{order.restaurantName || 'the kitchen'}</strong> is being prepared!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-2">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Order Reference</p>
              <p className="text-2xl font-bold text-[#FF6B35] font-mono">{order.id}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-gray-400">Order Placed At</p>
              <p className="text-sm font-semibold text-gray-700">
                {orderDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="py-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Delivering To</p>
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin size={16} className="text-[#FF6B35] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{order.deliveryAddress}</p>
                  {order.landmark && (
                    <p className="text-gray-400 text-xs mt-0.5">Near: {order.landmark}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Payment Method</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-[#FF6B35] shrink-0" />
                <div>
                  <p className="font-semibold">{order.paymentMethod || 'Online Payment'}</p>
                  <p className="text-gray-500 text-xs capitalize">
                    Status:{' '}
                    <span className="text-green-600 font-semibold">
                      {order.paymentStatus || 'Successful'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="py-6 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Order Items</p>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Bill Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{bill.itemSubtotal}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{bill.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className={bill.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes & Platform Fees</span>
                <span>₹{bill.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount Paid</span>
                <span className="text-xl text-[#FF6B35]">₹{bill.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track/${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Navigation size={18} />
            Track Live Order
          </Link>
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-200 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <ListOrdered size={18} />
            View My Orders
          </Link>
          <Link
            to="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-[#FF6B35] py-3.5 rounded-xl font-semibold hover:bg-orange-100 transition-all"
          >
            <ShoppingBag size={18} />
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}
