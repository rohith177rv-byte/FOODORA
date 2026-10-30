import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  Trash2,
  Tag,
  Check,
  X,
  Store,
  Info,
} from 'lucide-react';
import CartItem from '../components/CartItem.jsx';
import { useCart } from '../context/CartContext.jsx';
import { usePlatform } from '../context/PlatformContext.jsx';
import { calculateBill } from '../utils/billCalculator.js';

export default function Cart() {
  const { cartItems, appliedCoupon, applyCoupon, removeCoupon, clearCart, showToast } = useCart();
  const { platformSettings, promotions, restaurants } = usePlatform();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const bill = calculateBill(cartItems, {
    settings: platformSettings,
    coupon: appliedCoupon,
  });

  const cartRestaurant = restaurants.find(
    (r) => r.id === (cartItems[0]?.restaurantId || 'rest_1')
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    const promo = promotions.find(
      (p) => p.code.toUpperCase() === code && p.isActive
    );

    if (!promo) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    if (bill.subtotal < (promo.minOrderValue || 0)) {
      setCouponError(`Minimum order value for ${code} is ₹${promo.minOrderValue}.`);
      return;
    }

    applyCoupon(promo);
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-sm bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#FF6B35]">
            <ShoppingCart size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Good food is waiting for you! Explore our verified restaurants and build your favorite meal.
          </p>
          <div className="space-y-2.5">
            <Link
              to="/menu"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-orange-200"
            >
              <ShoppingBag size={16} />
              Explore Food Menu
            </Link>
            <Link
              to="/restaurants"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all"
            >
              <Store size={15} />
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Restaurant info and Clear button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>
            {cartRestaurant && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Store size={14} className="text-[#FF6B35]" />
                Ordering from{' '}
                <span className="font-bold text-gray-800">{cartRestaurant.name}</span> •{' '}
                {cartRestaurant.location}
              </p>
            )}
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors w-fit font-medium cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Free delivery teaser */}
            {bill.deliveryFee > 0 && bill.amountForFreeDelivery > 0 && (
              <div className="bg-orange-50 border border-orange-200/80 p-4 rounded-2xl flex items-center gap-3 text-xs text-gray-700">
                <div className="w-8 h-8 rounded-xl bg-white text-[#FF6B35] flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  ₹
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    Add ₹{bill.amountForFreeDelivery} more
                  </span>{' '}
                  of food to unlock <span className="font-bold text-green-600">FREE Delivery</span>!
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5">
              <h3 className="font-extrabold text-lg text-gray-900 pb-3 border-b border-gray-100">
                Order Bill Summary
              </h3>

              {/* Coupon Section */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Apply Discount Coupon
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-2xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-green-600" />
                      <div>
                        <span className="font-mono font-extrabold text-green-700">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[11px] text-green-600">
                          Discount of ₹{bill.discount} applied
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. WELCOME20, FREEDEL"
                        className="flex-1 uppercase font-mono px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-gray-900 hover:bg-[#FF6B35] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-500 font-medium">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>
                    Item Total ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-semibold text-gray-800">₹{bill.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span
                    className={
                      bill.deliveryFee === 0 ? 'text-green-600 font-bold' : 'font-semibold text-gray-800'
                    }
                  >
                    {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                  </span>
                </div>

                {bill.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-₹{bill.discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes & Restaurant GST (5%)</span>
                  <span className="font-semibold text-gray-800">₹{bill.tax}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-gray-900">
                  <span className="font-extrabold text-sm">Grand Total</span>
                  <span className="text-2xl font-black text-[#FF6B35]">₹{bill.grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-orange-200 active:scale-98 cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/menu"
                className="block text-center text-xs text-[#FF6B35] font-semibold hover:underline"
              >
                + Add more delicious dishes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
