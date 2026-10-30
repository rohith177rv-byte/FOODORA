import { Printer, UtensilsCrossed, Calendar, MapPin, Phone } from 'lucide-react';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function ReceiptModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const dateObj = new Date(order.createdAt || '2026-10-30T12:00:00Z');
  const dateFormatted = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Tax Invoice & Receipt" maxWidth="max-w-xl">
      <div className="printable-receipt space-y-6 text-gray-800">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-xl flex items-center justify-center text-white">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                FOOD<span className="text-[#FF6B35]">ORA</span>
              </span>
              <p className="text-[11px] text-gray-400">Official Food Order Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase">Receipt No.</p>
            <p className="font-mono font-bold text-gray-900 text-sm">{order.id}</p>
          </div>
        </div>

        {/* Restaurant & Date Meta */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl">
          <div>
            <p className="text-gray-400 uppercase font-bold text-[10px] mb-1">Restaurant</p>
            <p className="font-bold text-gray-900 text-sm">{order.restaurantName || 'Foodora Partner'}</p>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-[#FF6B35]" />
              {order.restaurantLocation || 'Mumbai, MH'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 uppercase font-bold text-[10px] mb-1">Order Placed On</p>
            <p className="font-semibold text-gray-800 flex items-center justify-end gap-1">
              <Calendar size={12} className="text-gray-400" />
              {dateFormatted}
            </p>
            <p className="text-gray-500 mt-0.5">{timeFormatted}</p>
            <div className="mt-2">
              <StatusBadge status={order.status} size="xs" />
            </div>
          </div>
        </div>

        {/* Customer & Delivery info */}
        <div className="border border-gray-100 p-4 rounded-2xl text-xs space-y-1.5">
          <p className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2">Billed To</p>
          <p className="font-semibold text-gray-900">{order.customerName}</p>
          <p className="text-gray-500 flex items-center gap-1.5">
            <Phone size={12} className="text-gray-400" />
            +91 {order.customerPhone || '9876543210'}
          </p>
          <p className="text-gray-500 flex items-start gap-1.5 pt-1">
            <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
            {order.deliveryAddress}
          </p>
        </div>

        {/* Itemized Table */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Itemized Food Breakdown
          </h4>
          <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 text-sm">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex justify-between items-center hover:bg-gray-50/50">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill summary breakdown */}
        <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
          <div className="flex justify-between text-gray-600">
            <span>Item Subtotal</span>
            <span>₹{order.bill.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Partner Fee</span>
            <span className={order.bill.deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
              {order.bill.deliveryFee === 0 ? 'FREE' : `₹${order.bill.deliveryFee}`}
            </span>
          </div>
          {order.bill.discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Promotion Coupon ({order.bill.couponCode || 'PROMO'})</span>
              <span>-₹{order.bill.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>GST / Taxes (5%)</span>
            <span>₹{order.bill.tax}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-2">
            <span>Total Paid</span>
            <span className="text-[#FF6B35]">₹{order.bill.grandTotal}</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 pt-1">
            <span>Payment Method: {order.paymentMethod}</span>
            <span className="font-mono">Ref: {order.transactionId || 'TXN-SUCCESS'}</span>
          </div>
        </div>

        {/* Footer print action */}
        <div className="pt-4 border-t border-gray-100 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-orange-200 active:scale-98 cursor-pointer"
          >
            <Printer size={16} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
