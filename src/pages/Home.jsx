import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  Truck,
  ShieldCheck,
  ChefHat,
  Search,
  Store,
  Compass,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';
import FoodCard from '../components/FoodCard.jsx';
import RestaurantCard from '../components/customer/RestaurantCard.jsx';
import { usePlatform } from '../context/PlatformContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { categories, testimonials } from '../data/foodData.js';

export default function Home() {
  const { foods, restaurants, promotions } = usePlatform();
  const { currentUser, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Active restaurants (exclude pending / suspended)
  const activeRestaurants = useMemo(
    () => restaurants.filter((r) => r.status === 'ACTIVE'),
    [restaurants]
  );

  // Featured restaurants
  const featuredRestaurants = useMemo(
    () => activeRestaurants.filter((r) => r.isFeatured || r.rating >= 4.6).slice(0, 4),
    [activeRestaurants]
  );

  // Best sellers & trending from dynamic platform foods
  const bestSellers = useMemo(
    () => foods.filter((f) => f.isBestSeller && f.isAvailable !== false).slice(0, 4),
    [foods]
  );

  const trendingDishes = useMemo(
    () => foods.filter((f) => f.isTrending && f.isAvailable !== false).slice(0, 4),
    [foods]
  );

  // Recent orders of current customer (if any)
  const recentCustomerOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter((o) => o.customerId === currentUser.id)
      .slice(0, 2);
  }, [orders, currentUser]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied! Apply at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9F3] via-white to-orange-50/70 border-b border-orange-100/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {/* Personalized Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 text-[#FF6B35] px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-2xs">
                <Sparkles size={14} />
                {isAuthenticated
                  ? `Welcome back, ${currentUser.name?.split(' ')[0]}!`
                  : 'AI-Powered Smart Food Ordering'}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                Good Food.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB347]">
                  Great Mood.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Discover top-rated restaurants, browse handcrafted dishes, and enjoy tailor-made meal recommendations tailored to your taste.
              </p>

              {/* Large Search Input */}
              <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="relative max-w-lg flex items-center bg-white rounded-2xl shadow-lg shadow-orange-100 border border-gray-200/80 p-1.5 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/20 transition-all">
                  <Search size={20} className="text-gray-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants, biryani, pizza, dosa..."
                    className="w-full px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all shadow-sm cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-orange-200 active:scale-95"
                >
                  <Compass size={17} />
                  Explore Restaurants
                </Link>
                <Link
                  to="/recommendations"
                  className="inline-flex items-center gap-2 bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-400 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-2xs hover:bg-purple-50 active:scale-95"
                >
                  <Sparkles size={17} className="text-purple-600" />
                  Find Your Perfect Meal
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-gray-200/60">
                {[
                  { value: `${activeRestaurants.length}+`, label: 'Partner Kitchens' },
                  { value: `${foods.length}+`, label: 'Delicious Dishes' },
                  { value: '4.8 ★', label: 'Customer Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative hidden md:block">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Delicious food feast"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-3 py-1 bg-[#FF6B35] rounded-full text-xs font-bold w-fit mb-2">
                    Fresh & Authentic
                  </span>
                  <p className="text-xl font-extrabold">Royal Mughlai & Handcrafted Platters</p>
                  <p className="text-xs text-white/80">Delivered hot to your doorstep in 30 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: '30-Min Delivery', desc: 'Average kitchen time' },
              { icon: ShieldCheck, label: '100% Certified', desc: 'Hygiene verified kitchens' },
              { icon: Truck, label: 'Free Delivery', desc: 'On orders above ₹299' },
              { icon: ChefHat, label: 'Master Chefs', desc: 'Handcrafted signature recipes' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-[#FF6B35] rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.label}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Orders Reminder (if available) */}
      {recentCustomerOrders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                Recent Order
              </span>
              <h3 className="text-xl font-extrabold">
                {recentCustomerOrders[0].restaurantName} • {recentCustomerOrders[0].items.length} item(s)
              </h3>
              <p className="text-xs text-white/90 mt-1">
                Total: ₹{recentCustomerOrders[0].bill.grandTotal} • Status: {recentCustomerOrders[0].status}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/track/${recentCustomerOrders[0].id}`}
                className="px-5 py-2.5 bg-white text-[#FF6B35] font-bold text-xs rounded-xl hover:bg-orange-50 transition-all shadow-sm"
              >
                Track / View Details
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Cuisines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Explore Cuisines</h2>
            <p className="text-sm text-gray-500 mt-1">What are you in the mood for today?</p>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <Link
                key={cat.id}
                to={`/menu?category=${encodeURIComponent(cat.id)}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6B35] hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-xs font-bold text-gray-700 group-hover:text-[#FF6B35] text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Store size={22} className="text-[#FF6B35]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Featured Restaurants
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Top-rated dining partners in Mumbai</p>
          </div>
          <Link
            to="/restaurants"
            className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            All Restaurants ({activeRestaurants.length}) <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* Special Offers & Promo Codes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Exclusive FOODORA Deals 🎁
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click to copy promo coupons and save instantly on your orders
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {promotions
            .filter((p) => p.isActive)
            .slice(0, 3)
            .map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-orange-100 text-[#FF6B35] rounded-full text-xs font-bold uppercase tracking-wider">
                      {promo.discountType === 'PERCENTAGE'
                        ? `${promo.discountValue}% OFF`
                        : `FLAT ₹${promo.discountValue} OFF`}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Min: ₹{promo.minOrderValue}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-1">{promo.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{promo.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="font-mono font-bold text-sm bg-orange-50 border border-dashed border-[#FF6B35]/40 text-[#FF6B35] px-3 py-1.5 rounded-xl">
                    {promo.code}
                  </div>
                  <button
                    onClick={() => copyCoupon(promo.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50 transition-all cursor-pointer"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Customer Best Sellers ⭐
            </h2>
            <p className="text-sm text-gray-500 mt-1">Our most repeatedly ordered dishes</p>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Trending Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Trending Now 🔥</h2>
            <p className="text-sm text-gray-500 mt-1">Crowd favorites ordered across the platform</p>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDishes.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* AI Recommendation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-[#FF6B35] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              ✨ Smart Food Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Not sure what to eat? Let our AI match your cravings.
            </h2>
            <p className="text-sm text-white/90 mb-6 leading-relaxed">
              Tell us your diet, favorite cuisine, budget, and spice level. Our smart algorithm will
              curate dishes made just for your mood!
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 bg-white text-purple-800 hover:bg-purple-50 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <Sparkles size={18} className="text-purple-600" />
              Try AI Meal Recommendation
            </Link>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Loved by Foodies across Mumbai
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real reviews from our daily diners</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-5 italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-xl flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">{t.name}</p>
                  <p className="text-[11px] text-gray-400">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
