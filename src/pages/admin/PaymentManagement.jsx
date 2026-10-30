import { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Clock,
  ArrowDownLeft,
  FileText,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function PaymentManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refundModal, setRefundModal] = useState({ open: false, order: null });

  // Map orders to transactions
  const transactions = useMemo(() => {
    return orders.map((o) => ({
      id: o.transactionId || `TXN-DEMO-${o.id}`,
      orderId: o.id,
      customerName: o.customerName,
      restaurantName: o.restaurantName,
      amount: o.grandTotal,
      method: o.paymentMethod || 'Credit Card',
      status: o.paymentStatus || 'SUCCESSFUL',
      date: o.createdAt || new Date().toISOString(),
      orderStatus: o.status,
      rawOrder: o,
    }));
  }, [orders]);

  // Filtered transactions
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMethod = methodFilter === 'ALL' || t.method.toLowerCase().includes(methodFilter.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [transactions, searchQuery, methodFilter, statusFilter]);

  // Aggregate metrics
  const totalVolume = useMemo(
    () => transactions.reduce((sum, t) => sum + (t.status !== 'FAILED' ? t.amount : 0), 0),
    [transactions]
  );
  const totalRefunded = useMemo(
    () => transactions.filter((t) => t.status === 'REFUNDED').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const codVolume = useMemo(
    () => transactions.filter((t) => t.method === 'Cash on Delivery').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const handleSimulateRefund = () => {
    if (!refundModal.order) return;
    const orderId = refundModal.order.rawOrder.id;

    // Simulate refund by updating order paymentStatus
    updateOrderStatus(orderId, refundModal.order.rawOrder.status, {
      paymentStatus: 'REFUNDED',
      refundedAt: new Date().toISOString(),
      refundReferenceId: `REF-${Math.floor(1000000 + Math.random() * 9000000)}`,
    });

    showToast?.(`Refund of ₹${refundModal.order.amount} initiated successfully!`, 'success');
    setRefundModal({ open: false, order: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Gateway Settlement</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor digital settlements, simulated UPI/Card payment transactions, and customer refunds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Processed Settlement Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{totalVolume.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.length} total platform transactions</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Refunded</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">₹{totalRefunded.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">
            {transactions.filter((t) => t.status === 'REFUNDED').length} transactions reversed
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">COD Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">₹{codVolume.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-1">Cash on doorstep collection</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Txn ID, Order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="Wallet">Digital Wallet</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESSFUL">Successful</option>
            <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No payment transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{t.id}</td>
                    <td className="px-4 py-3 font-mono text-brand-orange font-semibold">{t.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">{t.customerName}</p>
                      <p className="text-[11px] text-gray-400">{t.restaurantName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-gray-700">
                        {t.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-gray-900">₹{t.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'SUCCESSFUL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'REFUNDED'
                            ? 'bg-purple-100 text-purple-800'
                            : t.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.method !== 'Cash on Delivery' && t.status !== 'REFUNDED' && (
                        <button
                          onClick={() => setRefundModal({ open: true, order: t })}
                          className="px-2.5 py-1 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors cursor-pointer"
                        >
                          Simulate Refund
                        </button>
                      )}
                      {t.status === 'REFUNDED' && (
                        <span className="text-[11px] text-gray-400 italic">Reversed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {refundModal.open && (
        <Modal
          isOpen={refundModal.open}
          onClose={() => setRefundModal({ open: false, order: null })}
          title={`Simulate Refund: ${refundModal.order?.orderId}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              Are you sure you want to simulate a full payment reversal of{' '}
              <strong className="text-gray-900">₹{refundModal.order?.amount}</strong> for transaction{' '}
              <strong className="font-mono text-gray-900">{refundModal.order?.id}</strong>?
            </p>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-purple-800">
              <p className="font-semibold">Simulated Gateway Reversal Action:</p>
              <p className="mt-0.5">
                The order payment status will be updated to REFUNDED, generating a simulated refund reference ID.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundModal({ open: false, order: null })}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateRefund}
                className="px-4 py-2 font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer shadow-sm"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

