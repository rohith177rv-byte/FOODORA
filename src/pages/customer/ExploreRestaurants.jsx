import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Star, Clock, Compass } from 'lucide-react';
import RestaurantCard from '../../components/customer/RestaurantCard.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { categories } from '../../data/foodData.js';

export default function ExploreRestaurants() {
  const { restaurants, foods } = usePlatform();

  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only active (approved) restaurants
  const activeRestaurants = useMemo(
    () => restaurants.filter((r) => r.status === 'ACTIVE'),
    [restaurants]
  );

  const filteredRestaurants = useMemo(() => {
    let result = [...activeRestaurants];

    // Search by restaurant name or food dishes served
    if (search.trim()) {
      const q = search.toLowerCase();
      // Find food items matching query to link restaurants
      const matchingFoodRestIds = foods
        .filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
        .map((f) => f.restaurantId);

      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines?.some((c) => c.toLowerCase().includes(q)) ||
          r.location?.toLowerCase().includes(q) ||
          matchingFoodRestIds.includes(r.id)
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      result = result.filter((r) =>
        r.cuisines?.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())
      );
    }

    // Minimum rating filter
    if (Number(minRating) > 0) {
      result = result.filter((r) => r.rating >= Number(minRating));
    }

    // Delivery time filter
    if (deliveryFilter === 'quick') {
      result = result.filter((r) => {
        const timeNum = parseInt(r.deliveryTime) || 30;
        return timeNum <= 25;
      });
    }

    // Open now filter
    if (openOnly) {
      result = result.filter((r) => r.isOpen);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === 'delivery') {
      result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    } else if (sortBy === 'minOrder') {
      result.sort((a, b) => a.minOrder - b.minOrder);
    }

    return result;
  }, [activeRestaurants, foods, search, selectedCuisine, minRating, deliveryFilter, openOnly, sortBy]);

  const activeFilterCount = [
    selectedCuisine !== 'All',
    Number(minRating) > 0,
    deliveryFilter !== 'all',
    openOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch('');
    setSelectedCuisine('All');
    setMinRating('0');
    setDeliveryFilter('all');
    setOpenOnly(false);
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <Compass size={28} />
            <h1 className="text-3xl md:text-4xl font-extrabold">Discover Top Restaurants</h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            Explore authentic local kitchens, gourmet dining hubs, and quick bites delivered fresh across Mumbai.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Trigger Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine, or dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-sm transition-all shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer shadow-2xs ${
                showFilters || activeFilterCount > 0
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#FF6B35]'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white text-[#FF6B35] rounded-full text-[10px] font-extrabold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FF6B35] shadow-2xs cursor-pointer"
            >
              <option value="rating">Sort: Top Rated ★</option>
              <option value="reviews">Sort: Most Popular</option>
              <option value="delivery">Sort: Fastest Delivery</option>
              <option value="minOrder">Sort: Lowest Min Order</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8 space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Rating */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Customer Rating
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: '0', label: 'All Ratings' },
                    { val: '4.0', label: '4.0+ ★' },
                    { val: '4.5', label: '4.5+ ★' },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setMinRating(r.val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        minRating === r.val
                          ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Speed */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Delivery Speed
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeliveryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      deliveryFilter === 'all'
                        ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Any Time
                  </button>
                  <button
                    onClick={() => setDeliveryFilter('quick')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      deliveryFilter === 'quick'
                        ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    ⚡ Under 25 mins
                  </button>
                </div>
              </div>

              {/* Open Now Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Kitchen Availability
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={openOnly}
                    onChange={(e) => setOpenOnly(e.target.checked)}
                    className="rounded text-[#FF6B35] focus:ring-[#FF6B35] h-4 w-4"
                  />
                  <span className="text-xs font-bold text-gray-700">Open Now Only</span>
                </label>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cuisine Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCuisine('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCuisine === 'All'
                ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            🍽️ All Cuisines
          </button>
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCuisine(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCuisine.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredRestaurants.length}</span>{' '}
            verified restaurants
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No restaurants match your criteria</h3>
            <p className="text-xs text-gray-400 mb-4">Try clearing filters or search terms</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

