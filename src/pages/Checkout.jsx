import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { calculateBill } from '../utils/billCalculator.js';
import { placeOrder } from '../services/orderService.js';

export default function Checkout() {
  const { cartItems, clearCart, showToast } = useCart();
  const navigate = useNavigate();
  const bill = calculateBill(cartItems);

  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    address: '',
    instructions: '',
  });

  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) newErrors.address = 'Delivery address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    setPlacing(true);

    const order = await placeOrder({
      customerName: form.customerName.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      instructions: form.instructions.trim(),
      items: cartItems,
      bill,
    });

    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  useEffect(() => {
    if (cartItems.length === 0 && !placing) {
      navigate('/cart');
    }
  }, [cartItems.length, placing, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-[#FF6B35]" />
                Delivery Details
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User size={14} /> Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => updateField('customerName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.customerName
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} /> Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => updateField('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.mobile
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]'
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} /> Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all ${
                      errors.address
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare size={14} /> Special Instructions (Optional)
                  </label>
                  <textarea
                    value={form.instructions}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    placeholder="Any special instructions for the delivery"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg text-gray-800 mb-5">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-800 whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={bill.deliveryFee === 0 ? 'text-green-500' : ''}>
                    {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{bill.tax}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-gray-800">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-[#FF6B35]">₹{bill.grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="flex items-center justify-center gap-2 w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-semibold mt-6 transition-all hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98] disabled:opacity-60"
              >
                {placing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                No real payment required · Demo mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
