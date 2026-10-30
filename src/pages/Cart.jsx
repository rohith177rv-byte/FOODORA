import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem.jsx';
import { useCart } from '../context/CartContext.jsx';
import { calculateBill, FREE_DELIVERY_THRESHOLD } from '../utils/billCalculator.js';

export default function Cart() {
  const { cartItems } = useCart();
  const bill = calculateBill(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-[#FF6B35]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items yet</p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-200"
          >
            <ShoppingBag size={18} />
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg text-gray-800 mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="font-medium">₹{bill.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={`font-medium ${bill.deliveryFee === 0 ? 'text-green-500' : ''}`}>
                    {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium">₹{bill.tax}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-800">
                  <span className="font-bold text-base">Grand Total</span>
                  <span className="font-bold text-lg text-[#FF6B35]">₹{bill.grandTotal}</span>
                </div>
              </div>

              {bill.deliveryFee > 0 && (
                <p className="text-xs text-gray-400 mt-3 bg-orange-50 px-3 py-2 rounded-lg">
                  Add ₹{FREE_DELIVERY_THRESHOLD - bill.subtotal} more for free delivery!
                </p>
              )}

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-semibold mt-6 transition-all hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/menu"
                className="block text-center text-sm text-[#FF6B35] font-medium mt-3 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
