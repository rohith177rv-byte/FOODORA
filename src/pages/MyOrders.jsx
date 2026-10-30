import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Store,
  Compass,
  FileText,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ReceiptModal from '../components/common/ReceiptModal.jsx';
import Modal from '../components/common/Modal.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function MyOrders() {
  const { orders, cancelOrder, isCancellableByCustomer } = useOrders();
  const { currentUser, isAuthenticated } = useAuth();
  const { addToCart, showToast } = useCart();
  const navigate = useNavigate();

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, ACTIVE, DELIVERED, CANCELLED
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Cancellation modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed mind / ordered by mistake');

  // Customer's orders
  const customerOrders = useMemo(() => {
    if (!currentUser) return orders;
    return orders.filter(
      (o) => o.customerId === currentUser.id || o.customerEmail === currentUser.email
    );
  }, [orders, currentUser]);

  const filteredOrders = useMemo(() => {
    if (filterTab === 'ACTIVE') {
      return customerOrders.filter(
        (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
      );
    }
    if (filterTab === 'DELIVERED') {
      return customerOrders.filter((o) => o.status === 'DELIVERED');
    }
    if (filterTab === 'CANCELLED') {
      return customerOrders.filter((o) => o.status === 'CANCELLED');
    }
    return customerOrders;
  }, [customerOrders, filterTab]);

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantId: order.restaurantId,
      });
    });
    showToast(`Reordered ${order.items.length} dishes from ${order.restaurantName}!`, 'success');
    navigate('/cart');
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    cancelOrder(cancelModalOrder.id, cancelReason, '', 'CUSTOMER');
    setCancelModalOrder(null);
    showToast('Order cancelled successfully.', 'info');
  };

  if (customerOrders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-sm bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#FF6B35]">
            <Package size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No orders placed yet</h2>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            When you place an order with FOODORA, your live order tracker and past receipts will appear right here.
          </p>
          <Link
            to="/restaurants"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-bold text-xs transition-all shadow-md hover:shadow-orange-200"
          >
            <Compass size={16} />
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders & Receipts</h1>
            <p className="text-xs text-gray-500 mt-1">
              Track live food prep, view past meals, and download tax invoices
            </p>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
          >
            <ShoppingBag size={14} />
            Order More
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-2xs mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'ALL', label: `All Orders (${customerOrders.length})` },
            {
              id: 'ACTIVE',
              label: `Active (${
                customerOrders.filter(
                  (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
                ).length
              })`,
            },
            {
              id: 'DELIVERED',
              label: `Delivered (${
                customerOrders.filter((o) => o.status === 'DELIVERED').length
              })`,
            },
            {
              id: 'CANCELLED',
              label: `Cancelled (${
                customerOrders.filter((o) => o.status === 'CANCELLED').length
              })`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-orange-100 text-[#FF6B35]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center text-xs text-gray-400 border border-gray-100">
              No orders found in this category.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const date = new Date(order.createdAt);
              const isExpanded = expandedOrder === order.id;
              const isEligibleCancel = isCancellableByCustomer(order);
              const isActiveOrder = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Order Card Summary Top */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-extrabold text-gray-900 text-sm">
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} size="sm" />
                        {isActiveOrder && (
                          <Link
                            to={`/track/${order.id}`}
                            className="px-2.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                          >
                            Live Tracking →
                          </Link>
                        )}
                      </div>

                      <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                        <Store size={14} className="text-[#FF6B35]" />
                        {order.restaurantName}
                      </p>

                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
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
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">
                          Total Paid
                        </span>
                        <span className="text-lg font-black text-[#FF6B35]">
                          ₹{order.bill.grandTotal}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="p-2.5 text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 rounded-xl transition-all cursor-pointer border border-gray-200"
                          title="View & Print Invoice Receipt"
                        >
                          <FileText size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpand(order.id)}
                          className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer border border-gray-200"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 pt-4 bg-gray-50/40 space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Ordered Dishes
                        </h4>
                        <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 divide-y divide-gray-50">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="pt-2 first:pt-0 flex justify-between items-center text-xs"
                            >
                              <span className="text-gray-800 font-medium">
                                {item.name}{' '}
                                <span className="text-gray-400 font-normal">× {item.quantity}</span>
                              </span>
                              <span className="font-bold text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100">
                          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                            Delivery Address
                          </p>
                          <p className="text-gray-700 font-medium flex items-start gap-1">
                            <MapPin size={13} className="text-[#FF6B35] mt-0.5 shrink-0" />
                            {order.deliveryAddress}
                          </p>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100">
                          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                            Payment Details
                          </p>
                          <p className="text-gray-700 font-medium">
                            {order.paymentMethod} • Ref: {order.transactionId || 'SUCCESS'}
                          </p>
                          <p className="text-gray-400 text-[11px] mt-0.5">
                            Status: <span className="font-bold">{order.paymentStatus}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action buttons inside expanded view */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex gap-2">
                          {isEligibleCancel && (
                            <button
                              type="button"
                              onClick={() => setCancelModalOrder(order)}
                              className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}

                          {order.status === 'DELIVERED' && (
                            <Link
                              to={`/feedback?orderId=${order.id}&restId=${order.restaurantId}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all"
                            >
                              <MessageSquare size={13} />
                              Rate Food & Kitchen
                            </Link>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-[#FF6B35] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            <RotateCcw size={13} />
                            Reorder Meal
                          </button>
                          {isActiveOrder && (
                            <Link
                              to={`/track/${order.id}`}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-[#FF6B35] text-white rounded-xl text-xs font-bold hover:bg-[#e55a2b] transition-all"
                            >
                              Track Progress
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tax Invoice Receipt Modal */}
      <ReceiptModal
        order={selectedReceiptOrder}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        title="Cancel Food Order"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
          <p className="text-gray-600 leading-relaxed">
            Cancel order <span className="font-mono font-bold">{cancelModalOrder?.id}</span> from{' '}
            <span className="font-bold text-gray-900">{cancelModalOrder?.restaurantName}</span>?
          </p>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1.5">
              Select Reason
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
            >
              <option value="Changed mind / ordered by mistake">Changed mind / ordered by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Incorrect delivery address selected">Incorrect delivery address selected</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Confirm Cancellation
            </button>
            <button
              type="button"
              onClick={() => setCancelModalOrder(null)}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium"
            >
              Keep Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
