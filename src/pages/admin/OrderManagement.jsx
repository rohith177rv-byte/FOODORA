import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';

export default function OrderManagement() {
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const { restaurants } = usePlatform();
  const { showToast } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [restaurantFilter, setRestaurantFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [statusOverrideModal, setStatusOverrideModal] = useState({ open: false, order: null });
  const [targetStatus, setTargetStatus] = useState('DELIVERED');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesRestaurant =
        restaurantFilter === 'ALL' || o.restaurantId === restaurantFilter;

      return matchesSearch && matchesStatus && matchesRestaurant;
    });
  }, [orders, searchQuery, statusFilter, restaurantFilter]);

  const handleApplyStatusOverride = () => {
    if (!statusOverrideModal.order) return;
    const orderId = statusOverrideModal.order.id;

    if (targetStatus === 'CANCELLED') {
      cancelOrder(orderId, 'Administrative Cancellation', 'Overridden by Admin Ops Team', 'ADMIN');
      showToast?.(`Order ${orderId} cancelled by Admin override.`, 'warning');
    } else {
      updateOrderStatus(orderId, targetStatus);
      showToast?.(`Order ${orderId} status updated to ${targetStatus}`, 'success');
    }

    setStatusOverrideModal({ open: false, order: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Global monitoring of customer food requests, status overrides, and resolution handling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID, customer, restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Restaurants</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Details</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Bill Grand Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-brand-orange">{order.id}</p>
                      <p className="text-[11px] text-gray-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      {order.restaurantName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">₹{order.grandTotal}</span>
                      <span className="text-[10px] text-gray-400 block">{order.items?.length || 0} items</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-[11px]">{order.paymentMethod}</p>
                      <span
                        className={`text-[10px] font-bold ${
                          order.paymentStatus === 'SUCCESSFUL'
                            ? 'text-emerald-600'
                            : order.paymentStatus === 'REFUNDED'
                            ? 'text-purple-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-gray-600 hover:text-brand-orange hover:bg-orange-50 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReceiptOrder(order)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="View Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStatusOverrideModal({ open: true, order });
                            setTargetStatus(order.status);
                          }}
                          className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                          title="Override Status"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Inspection: ${selectedOrder.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">{selectedOrder.restaurantName}</p>
                <p className="text-gray-500">Ordered by {selectedOrder.customerName}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Delivery address */}
            <div className="p-3 bg-white border border-gray-100 rounded-lg">
              <span className="text-gray-400 block font-medium">Delivery Address</span>
              <p className="font-semibold text-gray-800 mt-0.5">{selectedOrder.deliveryAddress}</p>
              {selectedOrder.deliveryInstructions && (
                <p className="text-gray-500 mt-1 italic">Note: "{selectedOrder.deliveryInstructions}"</p>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Dishes in Order</h4>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-bold text-gray-900">{it.name}</span>
                      <span className="text-gray-500 ml-2">x{it.quantity}</span>
                      {it.customInstructions && (
                        <span className="block text-[10px] text-gray-400 italic">{it.customInstructions}</span>
                      )}
                    </div>
                    <span className="font-bold text-gray-900">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.itemSubtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span>₹{selectedOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax & Fees:</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="text-brand-orange">₹{selectedOrder.grandTotal}</span>
              </div>
            </div>

            {selectedOrder.cancellationReason && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700">
                <span className="font-bold block">Cancellation Reason:</span>
                <p>{selectedOrder.cancellationReason}</p>
                {selectedOrder.cancelledBy && (
                  <span className="text-[10px] block mt-1 font-semibold">Cancelled by: {selectedOrder.cancelledBy}</span>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Status Override Modal */}
      {statusOverrideModal.open && (
        <Modal
          isOpen={statusOverrideModal.open}
          onClose={() => setStatusOverrideModal({ open: false, order: null })}
          title={`Override Status for ${statusOverrideModal.order?.id}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              As platform administrator, you can manually advance or cancel this order if standard restaurant or delivery actions stalled.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select New Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-orange"
              >
                <option value="PLACED">PLACED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED (Force Cancel & Refund)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusOverrideModal({ open: false, order: null })}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStatusOverride}
                className="px-4 py-2 font-bold bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg cursor-pointer shadow-sm"
              >
                Apply Override
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
}

