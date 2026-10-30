import { useState, useMemo } from 'react';
import { Search, FileText, ChevronDown, ChevronUp, Package, Calendar, Clock } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';

export default function OrderHistory() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  const myRestId = currentUser?.restaurantId || 'rest_1';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [receiptOrder, setReceiptOrder] = useState(null);

  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.restaurantId === myRestId),
    [orders, myRestId]
  );

  const filtered = useMemo(() => {
    let result = [...restaurantOrders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items?.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === statusFilter);
    }

    return result;
  }, [restaurantOrders, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Archive Logs
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Kitchen Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of delivered, in-progress, and cancelled customer orders
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, or dish name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF6B35]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6B35] cursor-pointer"
        >
          <option value="ALL">All Statuses ({restaurantOrders.length})</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled / Rejected</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY">Ready for Pickup</option>
          <option value="PLACED">Placed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            No orders match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Dishes</th>
                  <th className="py-3.5 px-5">Grand Total</th>
                  <th className="py-3.5 px-5">Payment</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((order) => {
                  const date = new Date(order.createdAt);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                        {date.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        •{' '}
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                        {order.customerName}
                      </td>
                      <td className="py-3.5 px-5 max-w-xs truncate text-slate-600">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                        ₹{order.bill.grandTotal}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-slate-500">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <StatusBadge status={order.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setReceiptOrder(order)}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#FF6B35] hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText size={12} />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}

