import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import FoodCard from '../components/FoodCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { getAllFoods } from '../services/foodService.js';

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAllFoods();
      setFoods(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...foods];

    // Search
    if (search.trim()) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category !== 'all') {
      result = result.filter((f) => f.category === category);
    }

    // Veg filter
    if (vegFilter === 'veg') {
      result = result.filter((f) => f.isVeg);
    } else if (vegFilter === 'nonveg') {
      result = result.filter((f) => !f.isVeg);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [foods, search, category, vegFilter, sortBy]);

  const activeFilterCount = [
    category !== 'all',
    vegFilter !== 'all',
    sortBy !== 'default',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Explore Our Menu</h1>
          <p className="text-white/80 text-lg">Find your next favourite dish from our curated collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6B35]'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-white text-[#FF6B35] rounded-full text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-40 mb-6' : 'max-h-0'}`}>
          <div className="flex flex-wrap gap-4 p-5 bg-white rounded-2xl border border-gray-100">
            {/* Veg/Non-Veg */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Diet</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'veg', label: '🟢 Veg' },
                  { value: 'nonveg', label: '🔴 Non-Veg' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setVegFilter(opt.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      vegFilter === opt.value
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-1.5 rounded-lg text-sm bg-gray-100 border-none focus:ring-2 focus:ring-[#FF6B35]/30 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {/* Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button
                  onClick={() => { setVegFilter('all'); setSortBy('default'); setCategory('all'); }}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <CategoryFilter selectedCategory={category} onCategoryChange={setCategory} />
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> dish{filtered.length !== 1 ? 'es' : ''}
        </p>

        {/* Food Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No dishes found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); setVegFilter('all'); setSortBy('default'); }}
              className="text-[#FF6B35] font-semibold hover:underline"
            >
              Reset all filters
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
