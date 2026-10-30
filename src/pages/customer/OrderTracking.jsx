import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Store,
  ChevronLeft,
  AlertCircle,
  XCircle,
  FileText,
  Play,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function OrderTracking() {
  const { orderId } = useParams();
  const { getOrderById, updateOrderStatus, cancelOrder, isCancellableByCustomer } = useOrders();
  const { showToast } = useCart();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind / ordered by mistake');
  const [cancelComments, setCancelComments] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);

  const order = getOrderById(orderId);

  const steps = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Received by FOODORA' },
    { key: 'ACCEPTED', title: 'Restaurant Accepted', desc: 'Kitchen acknowledged order' },
    { key: 'PREPARING', title: 'Food Preparation', desc: 'Chefs cooking your meal' },
    { key: 'READY', title: 'Ready for Pickup', desc: 'Packaged & awaiting courier' },
    { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'Courier heading to your door' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Enjoy your delicious food!' },
  ];

  const currentStepIndex = useMemo(() => {
    if (!order) return 0;
    if (order.status === 'CANCELLED') return -1;
    const index = steps.findIndex((s) => s.key === order.status);
    return index !== -1 ? index : 0;
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-sm">
          <p className="text-4xl mb-3">📦</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            We couldn't locate an active order matching reference: <span className="font-mono">{orderId}</span>
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl text-xs font-bold"
          >
            <ChevronLeft size={16} />
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isEligibleForCancel = isCancellableByCustomer(order);

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    cancelOrder(order.id, cancelReason, cancelComments, 'CUSTOMER');
    setCancelModalOpen(false);
    showToast('Order cancelled. Simulated refund initiated.', 'info');
  };

  // Demo helper: Advance to next step for instant testing
  const handleAdvanceStep = () => {
    const nextStatuses = ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = nextStatuses.indexOf(order.status);
    if (currentIdx < nextStatuses.length - 1) {
      const nextStatus = nextStatuses[currentIdx + 1];
      updateOrderStatus(order.id, nextStatus);
      showToast(`Simulated status advanced to: ${nextStatus}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF6B35]"
          >
            <ChevronLeft size={16} />
            Back to My Orders
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setReceiptOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <FileText size={14} className="text-[#FF6B35]" />
              View Receipt
            </button>
          </div>
        </div>

        {/* Top Tracking Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Live Order Tracker
              </span>
              <h1 className="text-2xl font-black text-gray-900 mt-0.5">
                Order <span className="text-[#FF6B35] font-mono">{order.id}</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Store size={14} className="text-[#FF6B35]" />
                Kitchen:{' '}
                <span className="font-bold text-gray-800">{order.restaurantName}</span>
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <StatusBadge status={order.status} size="lg" />
              <p className="text-xs text-gray-400">
                Est. Delivery Time: <span className="font-bold text-gray-800">{order.estimatedPrepTime}</span>
              </p>
            </div>
          </div>

          {/* Cancellation Banner if cancelled */}
          {order.status === 'CANCELLED' && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-start gap-3.5 text-xs text-rose-800">
              <XCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">This order was cancelled</p>
                <p>
                  Reason: <span className="font-semibold">{order.cancellationReason || 'Requested by customer'}</span>
                </p>
                {order.paymentMethod !== 'Cash on Delivery' && (
                  <p className="text-rose-700 font-medium pt-1">
                    Simulated refund status: <span className="font-bold font-mono">REFUNDED</span>. Demo credits returned to original payment source.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Visual Step Timeline */}
          {order.status !== 'CANCELLED' && (
            <div className="py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                Delivery Milestones
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-gray-100 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (currentStepIndex / (steps.length - 1)) * 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 sm:gap-2">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                            isDone
                              ? 'bg-[#FF6B35] text-white ring-4 ring-orange-100'
                              : 'bg-gray-100 text-gray-400'
                          } ${isCurrent ? 'animate-bounce-subtle ring-4 ring-orange-200' : ''}`}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                        </div>
                        <div className="sm:max-w-[120px]">
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Step Simulator Toolbar for Hackathon Demo */}
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <div className="bg-purple-50/70 border border-purple-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Play size={14} className="fill-purple-600 text-purple-600" />
                  Hackathon Fast-Forward: Live Status Simulation
                </p>
                <p className="text-[11px] text-purple-700">
                  You can also advance this order in real-time from the Restaurant Dashboard!
                </p>
              </div>
              <button
                onClick={handleAdvanceStep}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Simulate Next Step →
              </button>
            </div>
          )}

          {/* Cancellation Action Box */}
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-600">
                  {isEligibleForCancel ? (
                    <span>
                      Order not in kitchen yet. You can cancel with full automated refund.
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">
                      Kitchen is already cooking your order! Cancellation at this stage requires restaurant assistance.
                    </span>
                  )}
                </p>
              </div>

              {isEligibleForCancel && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Delivery & Contact Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Delivery Information
            </h4>
            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Recipient</p>
                <p className="font-semibold text-gray-900 mt-0.5">{order.customerName}</p>
                <p className="text-gray-500">+91 {order.customerPhone}</p>
              </div>

              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Delivery Address</p>
                <p className="font-medium text-gray-800 mt-0.5 flex items-start gap-1.5">
                  <MapPin size={14} className="text-[#FF6B35] mt-0.5 shrink-0" />
                  {order.deliveryAddress}
                </p>
              </div>

              {order.instructions && (
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold">Special Instructions</p>
                  <p className="text-gray-600 italic mt-0.5">"{order.instructions}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Food Items */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Ordered Items ({order.items?.length || 0})
            </h4>

            <div className="space-y-2.5 max-h-48 overflow-y-auto divide-y divide-gray-50 pr-1 text-xs">
              {order.items?.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                    <span className="font-medium text-gray-800">
                      {item.name} <span className="text-gray-400 font-normal">× {item.quantity}</span>
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Grand Total Paid</span>
              <span className="text-lg font-black text-[#FF6B35]">₹{order.bill?.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Order Cancellation"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to cancel order <span className="font-mono font-bold">{order.id}</span>?
            Since preparation has not begun, your order will be cancelled immediately and simulated payment will be refunded.
          </p>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1.5">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="Changed mind / ordered by mistake">Changed mind / ordered by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Incorrect delivery address selected">Incorrect delivery address selected</option>
              <option value="Forgot to apply discount coupon">Forgot to apply discount coupon</option>
              <option value="Other reason">Other reason</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={cancelComments}
              onChange={(e) => setCancelComments(e.target.value)}
              placeholder="Any comments for the kitchen..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35] resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Yes, Cancel Order
            </button>
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 cursor-pointer"
            >
              Keep Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Receipt Modal */}
      <ReceiptModal order={order} isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} />
    </div>
  );
}

