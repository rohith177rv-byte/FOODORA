import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Wallet,
  AlertTriangle,
  ChevronLeft,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { usePlatform } from '../context/PlatformContext.jsx';
import { calculateBill } from '../utils/billCalculator.js';

export default function Checkout() {
  const { cartItems, appliedCoupon, clearCart, showToast } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const { platformSettings, restaurants } = usePlatform();
  const navigate = useNavigate();

  const bill = calculateBill(cartItems, {
    settings: platformSettings,
    coupon: appliedCoupon,
  });

  const cartRestaurant = restaurants.find(
    (r) => r.id === (cartItems[0]?.restaurantId || 'rest_1')
  );

  const [form, setForm] = useState({
    customerName: currentUser?.name || '',
    mobile: currentUser?.phone || '',
    address: currentUser?.addresses?.[0]?.address || '',
    landmark: currentUser?.addresses?.[0]?.landmark || '',
    instructions: '',
  });

  // Selected payment method: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'COD' | 'WALLET'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('foodie@okhdfcbank');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8892',
    nameOnCard: currentUser?.name || 'Aarav Sharma',
    expiry: '08/29',
    cvv: '•••',
  });
  const [simulateOutcome, setSimulateOutcome] = useState('SUCCESS'); // 'SUCCESS' | 'FAILURE'

  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [paymentFailedError, setPaymentFailedError] = useState('');

  // Update form if user logs in
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        mobile: prev.mobile || currentUser.phone || '',
        address: prev.address || currentUser.addresses?.[0]?.address || '',
        landmark: prev.landmark || currentUser.addresses?.[0]?.landmark || '',
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (cartItems.length === 0 && !placing) {
      navigate('/cart');
    }
  }, [cartItems.length, placing, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!form.address.trim()) newErrors.address = 'Delivery address is required';

    if (paymentMethod === 'UPI' && !upiId.trim()) {
      newErrors.upi = 'Enter a valid UPI ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    setPaymentFailedError('');
    if (!validate()) return;

    setPlacing(true);

    // Simulate payment processing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Handle simulated payment failure demo
    if (simulateOutcome === 'FAILURE' && paymentMethod !== 'COD') {
      setPlacing(false);
      setPaymentFailedError(
        'Simulated Payment Failure: Your issuing bank declined the transaction. Switch simulation to "Success" or select Cash on Delivery to proceed.'
      );
      showToast('Payment Simulation Failed', 'error');
      return;
    }

    const paymentMethodLabels = {
      UPI: 'UPI (GPay/PhonePe)',
      CREDIT_CARD: 'Credit Card',
      DEBIT_CARD: 'Debit Card',
      COD: 'Cash on Delivery',
      WALLET: 'Digital Wallet',
    };

    const finalPaymentMethod = paymentMethodLabels[paymentMethod] || 'UPI';

    const order = await placeOrder({
      customerId: currentUser?.id || `guest_${Date.now()}`,
      customerName: form.customerName.trim(),
      customerEmail: currentUser?.email || 'guest@foodora.com',
      customerPhone: form.mobile.trim(),
      restaurantId: cartRestaurant?.id || 'rest_1',
      restaurantName: cartRestaurant?.name || 'Spice Symphony',
      restaurantLocation: cartRestaurant?.location || 'Bandra West, Mumbai',
      address: form.address.trim() + (form.landmark ? `, Landmark: ${form.landmark.trim()}` : ''),
      instructions: form.instructions.trim(),
      items: cartItems,
      bill,
      paymentMethod: finalPaymentMethod,
      paymentStatus: finalPaymentMethod === 'Cash on Delivery' ? 'CASH_ON_DELIVERY' : 'SUCCESSFUL',
    });

    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#FF6B35] mb-6"
        >
          <ChevronLeft size={16} />
          Back to Shopping Cart
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout & Payment</h1>

        {paymentFailedError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-700 font-medium">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Payment Simulation Triggered</p>
              <p className="mt-0.5">{paymentFailedError}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Delivery Address Details
                  </h3>
                </div>

                {/* Quick address picker if user has saved addresses */}
                {currentUser?.addresses?.length > 0 && (
                  <div className="flex gap-2">
                    {currentUser.addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            address: addr.address,
                            landmark: addr.landmark || '',
                          }));
                        }}
                        className="text-[11px] font-bold text-[#FF6B35] bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Use {addr.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.customerName}
                        onChange={(e) => updateField('customerName', e.target.value)}
                        placeholder="Recipient full name"
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    {errors.customerName && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      10-Digit Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={form.mobile}
                        onChange={(e) => updateField('mobile', e.target.value)}
                        placeholder="Mobile for delivery OTP"
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Complete Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3 text-gray-400" />
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Flat / House number, building name, street, area, pin code"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35] resize-none"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Landmark (Optional)
                    </label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.landmark}
                        onChange={(e) => updateField('landmark', e.target.value)}
                        placeholder="e.g. Near Metro Station"
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Cooking & Delivery Note
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.instructions}
                        onChange={(e) => updateField('instructions', e.target.value)}
                        placeholder="e.g. Leave with security, extra napkins"
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Payment Method (Simulated Demo)
                  </h3>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
                  { id: 'WALLET', label: 'Wallets', icon: Wallet },
                  { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-[#FF6B35] bg-orange-50/70 text-[#FF6B35] font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <m.icon size={20} />
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-interface for chosen payment */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/70 text-xs space-y-3">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-3">
                    <p className="font-bold text-gray-800">Instant UPI Payment</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi, username@okhdfcbank"
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-1 text-gray-500 text-[11px]">
                      <span>Accepted:</span>
                      <span className="font-bold text-gray-700">Google Pay</span>
                      <span>•</span>
                      <span className="font-bold text-gray-700">PhonePe</span>
                      <span>•</span>
                      <span className="font-bold text-gray-700">Paytm</span>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
                  <div className="space-y-3">
                    <p className="font-bold text-gray-800">
                      {paymentMethod === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card'} Details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, expiry: e.target.value })
                          }
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cvv: e.target.value })
                          }
                          placeholder="CVV"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'WALLET' && (
                  <div>
                    <p className="font-bold text-gray-800 mb-2">Select Digital Wallet</p>
                    <div className="flex gap-2">
                      {['Amazon Pay', 'Paytm Wallet', 'MobiKwik'].map((w, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600 shrink-0" />
                    <span>Pay with exact cash or scan QR when delivery partner arrives.</span>
                  </div>
                )}
              </div>

              {/* Hackathon Simulation Controls */}
              <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    ⚙️ Hackathon Payment Simulator
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome('SUCCESS')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        simulateOutcome === 'SUCCESS'
                          ? 'bg-green-600 text-white shadow-2xs'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      Simulate: Success
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome('FAILURE')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        simulateOutcome === 'FAILURE'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      Simulate: Failure
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-purple-700">
                  Toggle above to test how FOODORA handles simulated gateway successes vs declines!
                </p>
              </div>
            </div>
          </div>

          {/* Right Order Review & Place Button */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5">
              <h3 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
                Order Review
              </h3>

              {/* Kitchen Tag */}
              {cartRestaurant && (
                <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-2xl text-xs">
                  <p className="font-bold text-gray-900">{cartRestaurant.name}</p>
                  <p className="text-gray-500 text-[11px]">{cartRestaurant.location}</p>
                </div>
              )}

              {/* Items summary */}
              <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-gray-50 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between text-xs">
                    <span className="text-gray-700 truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-gray-900 shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs border-t border-gray-100 pt-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={bill.deliveryFee === 0 ? 'text-green-600 font-bold' : ''}>
                    {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                  </span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount Coupon</span>
                    <span>-₹{bill.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span>₹{bill.tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Amount to Pay</span>
                  <span className="text-xl text-[#FF6B35]">₹{bill.grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-orange-200 active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {placing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Demo Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Place Order (₹{bill.grandTotal})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                Demo transaction only · No real payments processed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
