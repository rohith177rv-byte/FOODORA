import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, UtensilsCrossed, Store } from 'lucide-react';
import FoodCard from '../components/FoodCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { usePlatform } from '../context/PlatformContext.jsx';

export default function Menu() {
  const { foods, restaurants } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state if URL search params change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  // Active restaurants list for filter dropdown
  const activeRestaurants = useMemo(
    () => restaurants.filter((r) => r.status === 'ACTIVE'),
    [restaurants]
  );

  const filtered = useMemo(() => {
    let result = [...foods];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'all') {
      result = result.filter(
        (f) => f.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Veg filter
    if (vegFilter === 'veg') {
      result = result.filter((f) => f.isVeg);
    } else if (vegFilter === 'nonveg') {
      result = result.filter((f) => !f.isVeg);
    }

    // Restaurant filter
    if (restaurantFilter !== 'all') {
      result = result.filter((f) => f.restaurantId === restaurantFilter);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [foods, search, category, vegFilter, restaurantFilter, sortBy]);

  const activeFilterCount = [
    category !== 'all',
    vegFilter !== 'all',
    restaurantFilter !== 'all',
    sortBy !== 'default',
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearch('');
    setCategory('all');
    setVegFilter('all');
    setRestaurantFilter('all');
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <UtensilsCrossed size={28} />
            <h1 className="text-3xl md:text-4xl font-extrabold">Explore Our Food Menu</h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            Browse our complete selection of fresh delicacies, cooked to perfection by top partner kitchens.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for biryani, burger, dosa, pizza..."
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
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated ★</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Diet */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Dietary Preference
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'veg', label: '🟢 Veg' },
                    { value: 'nonveg', label: '🔴 Non-Veg' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVegFilter(opt.value)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        vegFilter === opt.value
                          ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Filter */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Select Kitchen / Restaurant
                </label>
                <select
                  value={restaurantFilter}
                  onChange={(e) => setRestaurantFilter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                >
                  <option value="all">All Restaurants ({activeRestaurants.length})</option>
                  {activeRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer mb-2"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="mb-8">
          <CategoryFilter selectedCategory={category} onCategoryChange={setCategory} />
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filtered.length}</span> delicious dish{filtered.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Food Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-5xl mb-4">🍽️</p>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No dishes match your criteria</h3>
            <p className="text-xs text-gray-400 mb-4">Try clearing filters or search terms</p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
