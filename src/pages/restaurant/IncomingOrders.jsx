import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Package,
  Truck,
  Eye,
  MessageSquare,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function IncomingOrders() {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useCart();

  const myRestId = currentUser?.restaurantId || 'rest_1';

  // Active / Incoming orders for this kitchen
  const activeOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.restaurantId === myRestId &&
        o.status !== 'DELIVERED' &&
        o.status !== 'CANCELLED'
    );
  }, [orders, myRestId]);

  // Modals state
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Kitchen at peak capacity');
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  const handleAccept = (orderId) => {
    updateOrderStatus(orderId, 'ACCEPTED');
    showToast('Order accepted! Customer notified.', 'success');
  };

  const handleStartPreparing = (orderId) => {
    updateOrderStatus(orderId, 'PREPARING');
    showToast('Order moved to Cooking in Kitchen.', 'info');
  };

  const handleMarkReady = (orderId) => {
    updateOrderStatus(orderId, 'READY');
    showToast('Order packaged & marked Ready for Pickup!', 'success');
  };

  const handleHandoverDelivery = (orderId) => {
    updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
    showToast('Order handed to courier! Status: Out for delivery.', 'success');
  };

  const handleMarkDelivered = (orderId) => {
    updateOrderStatus(orderId, 'DELIVERED');
    showToast('Order marked as successfully Delivered!', 'success');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    updateOrderStatus(rejectModalOrder.id, 'REJECTED', { reason: rejectionReason });
    setRejectModalOrder(null);
    showToast('Order rejected with reason. Customer refunded.', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Kitchen Action Center
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            Incoming & Active Orders Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept, prepare, package, and dispatch orders in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-orange-100 text-[#FF6B35] font-black rounded-xl text-xs">
            {activeOrders.length} In-Progress Order{activeOrders.length !== 1 ? 's' : ''}
          </span>
          <Link
            to="/restaurant/order-history"
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs"
          >
            Past Order History
          </Link>
        </div>
      </div>

      {/* Orders List / Cards */}
      {activeOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Kitchen Queue is Clear!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            There are no active incoming orders right now. Switch to the customer portal to place a new test order and see it arrive here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => {
            const date = new Date(order.createdAt);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-slate-900">
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                    <span className="text-xs text-slate-400">
                      Placed at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Bill:</span>
                    <span className="text-base font-black text-[#FF6B35]">
                      ₹{order.bill.grandTotal}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-bold">
                      ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Items and Customer Details */}
                <div className="grid sm:grid-cols-3 gap-6 text-xs">
                  {/* Items */}
                  <div className="sm:col-span-2 space-y-2">
                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Items to Prepare
                    </p>
                    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="text-slate-500 font-semibold">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.instructions && (
                      <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 flex items-start gap-1.5 font-medium">
                        <MessageSquare size={14} className="shrink-0 mt-0.5" />
                        <span>Customer Note: "{order.instructions}"</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Delivery info */}
                  <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Customer & Delivery
                    </p>
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-slate-500">+91 {order.customerPhone}</p>
                    <p className="text-slate-600 line-clamp-2 mt-1">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Restaurant Workflow Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailsOrder(order)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(order)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Print Ticket
                    </button>
                  </div>

                  {/* Progressive Kitchen Actions based on Status */}
                  <div className="flex items-center gap-2">
                    {order.status === 'PLACED' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectModalOrder(order)}
                          className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                        >
                          Reject with Reason
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccept(order.id)}
                          className="px-5 py-2 text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e55a2b] rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Accept Order
                        </button>
                      </>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        type="button"
                        onClick={() => handleStartPreparing(order.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ChefHat size={15} />
                        Start Cooking / Preparing
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        type="button"
                        onClick={() => handleMarkReady(order.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Package size={15} />
                        Mark as Packaged & Ready
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        type="button"
                        onClick={() => handleHandoverDelivery(order.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck size={15} />
                        Hand Over to Courier
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        type="button"
                        onClick={() => handleMarkDelivered(order.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        Confirm Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Order Modal */}
      <Modal
        isOpen={!!rejectModalOrder}
        onClose={() => setRejectModalOrder(null)}
        title="Reject Incoming Order"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Please specify why you are unable to fulfill order{' '}
            <span className="font-mono font-bold">{rejectModalOrder?.id}</span>.
            The customer will be notified and any online payment will be refunded.
          </p>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="Kitchen at peak capacity / rush hour">Kitchen at peak capacity / rush hour</option>
              <option value="Ingredients temporarily out of stock">Ingredients temporarily out of stock</option>
              <option value="Kitchen closing for break">Kitchen closing for break</option>
              <option value="Cannot fulfill custom instructions">Cannot fulfill custom instructions</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Confirm Rejection
            </button>
            <button
              type="button"
              onClick={() => setRejectModalOrder(null)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Keep Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!detailsOrder}
        onClose={() => setDetailsOrder(null)}
        title="Full Order Details"
        maxWidth="max-w-lg"
      >
        {detailsOrder && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-mono font-bold text-base text-slate-900">
                {detailsOrder.id}
              </span>
              <StatusBadge status={detailsOrder.status} size="sm" />
            </div>

            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                Dishes
              </p>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {detailsOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between font-semibold">
                    <span>
                      {i.name} (x{i.quantity})
                    </span>
                    <span>₹{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Customer
                </p>
                <p className="font-semibold">{detailsOrder.customerName}</p>
                <p className="text-slate-500">+91 {detailsOrder.customerPhone}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Payment
                </p>
                <p className="font-semibold">{detailsOrder.paymentMethod}</p>
                <p className="text-slate-500">Total: ₹{detailsOrder.bill.grandTotal}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                Delivery Address
              </p>
              <p className="text-slate-600">{detailsOrder.deliveryAddress}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Printable Receipt */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}

