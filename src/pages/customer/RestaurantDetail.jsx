import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Heart,
  ChevronLeft,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import FoodCard from '../../components/FoodCard.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function RestaurantDetail() {
  const { restaurantId } = useParams();
  const { restaurants, foods, reviews } = usePlatform();
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('all'); // all, veg, nonveg
  const [activeTab, setActiveTab] = useState('menu'); // menu, reviews

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === restaurantId),
    [restaurants, restaurantId]
  );

  const isFav = isFavoriteRestaurant(restaurantId);

  // Dishes for this restaurant
  const restaurantFoods = useMemo(
    () => foods.filter((f) => f.restaurantId === restaurantId),
    [foods, restaurantId]
  );

  // Categories available at this restaurant
  const availableCategories = useMemo(() => {
    const cats = new Set(restaurantFoods.map((f) => f.category));
    return ['All', ...Array.from(cats)];
  }, [restaurantFoods]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    let result = [...restaurantFoods];

    if (selectedCategory !== 'All') {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (dietFilter === 'veg') {
      result = result.filter((f) => f.isVeg);
    } else if (dietFilter === 'nonveg') {
      result = result.filter((f) => !f.isVeg);
    }

    return result;
  }, [restaurantFoods, selectedCategory, dietFilter]);

  // Reviews for this restaurant
  const restaurantReviews = useMemo(
    () => reviews.filter((rev) => rev.restaurantId === restaurantId),
    [reviews, restaurantId]
  );

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-sm">
          <p className="text-4xl mb-3">🏪</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <p className="text-xs text-gray-500 mb-6">
            The requested restaurant may be pending approval or unavailable.
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl text-xs font-bold"
          >
            <ChevronLeft size={16} />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] pb-16">
      {/* Restaurant Hero Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gray-900">
        <img
          src={restaurant.banner || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />

        {/* Back Link */}
        <Link
          to="/restaurants"
          className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold hover:bg-white shadow-sm transition-all"
        >
          <ChevronLeft size={16} />
          All Kitchens
        </Link>

        {/* Favorite toggle */}
        <button
          onClick={() => toggleFavoriteRestaurant(restaurant.id)}
          className={`absolute top-6 right-6 z-10 w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            isFav
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 text-gray-700 hover:text-red-500 shadow-sm'
          }`}
        >
          <Heart size={18} className={isFav ? 'fill-current' : ''} />
        </button>

        {/* Hero Header Meta */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    restaurant.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                >
                  {restaurant.isOpen ? 'Open Now' : 'Closed for Orders'}
                </span>
                <span className="text-white/80 text-xs">• {restaurant.openingHours}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-white/90 text-sm mt-1 max-w-xl">{restaurant.tagline}</p>
              <p className="text-white/70 text-xs mt-2 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#FF6B35]" />
                {restaurant.address}
              </p>
            </div>

            {/* Rating & Delivery Stats Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex gap-6 text-center">
              <div>
                <span className="flex items-center justify-center gap-1 text-yellow-400 font-extrabold text-lg">
                  <Star size={18} className="fill-current" />
                  {restaurant.rating || '4.5'}
                </span>
                <p className="text-[10px] text-white/80 uppercase font-semibold mt-0.5">
                  {restaurant.reviewCount || 100}+ Reviews
                </p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <span className="text-white font-extrabold text-lg flex items-center justify-center gap-1">
                  <Clock size={16} className="text-[#FF6B35]" />
                  {restaurant.deliveryTime}
                </span>
                <p className="text-[10px] text-white/80 uppercase font-semibold mt-0.5">
                  Est. Delivery
                </p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <span className="text-white font-extrabold text-lg">₹{restaurant.minOrder}</span>
                <p className="text-[10px] text-white/80 uppercase font-semibold mt-0.5">
                  Min. Order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice if restaurant is marked closed */}
      {!restaurant.isOpen && (
        <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          This kitchen is currently closed. You can view the menu, but items cannot be ordered right now.
        </div>
      )}

      {/* Tab Switcher: Menu vs Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Food Menu ({restaurantFoods.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Customer Reviews ({restaurantReviews.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'menu' ? (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Diet toggles */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'veg', label: '🟢 Veg' },
                  { id: 'nonveg', label: '🔴 Non-Veg' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietFilter(d.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dietFilter === d.id
                        ? 'bg-orange-100 text-[#FF6B35]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Grid */}
            {filteredDishes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-4xl mb-3">🍽️</p>
                <h3 className="text-base font-bold text-gray-800">No dishes in this category</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Try selecting another category or diet option
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDishes.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Customer Reviews Tab */
          <div className="max-w-3xl space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xl text-gray-900">Customer Ratings & Reviews</h3>
                <p className="text-xs text-gray-500 mt-1">Verified reviews from FOODORA diners</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-2xl">
                <Star size={24} className="fill-green-600 text-green-600" />
                <span className="text-2xl font-black text-green-700">
                  {restaurant.rating || '4.5'}
                </span>
                <span className="text-xs text-gray-400">/ 5</span>
              </div>
            </div>

            {restaurantReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400 text-xs">
                No customer reviews submitted for this restaurant yet. Be the first to order and review!
              </div>
            ) : (
              <div className="space-y-4">
                {restaurantReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{rev.customerName}</p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-xl text-xs font-bold">
                        <Star size={13} className="fill-current text-yellow-500" />
                        {rev.rating} ★
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                    {rev.restaurantResponse && (
                      <div className="bg-orange-50/60 border border-orange-100 p-3.5 rounded-2xl text-xs space-y-1">
                        <p className="font-bold text-[#FF6B35] flex items-center gap-1">
                          <MessageSquare size={12} />
                          Response from {restaurant.name}:
                        </p>
                        <p className="text-gray-600 italic">{rev.restaurantResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

