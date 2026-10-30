import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, UtensilsCrossed, ShoppingBag, ArrowRight } from 'lucide-react';
import FoodCard from '../../components/FoodCard.jsx';
import RestaurantCard from '../../components/customer/RestaurantCard.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';

export default function Favorites() {
  const { favoriteFoods, favoriteRestaurants } = useCart();
  const { foods, restaurants } = usePlatform();

  const [activeTab, setActiveTab] = useState('foods'); // 'foods' | 'restaurants'

  const favDishes = foods.filter((f) => favoriteFoods.includes(f.id));
  const favKitchens = restaurants.filter((r) => favoriteRestaurants.includes(r.id));

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Heart size={24} className="text-red-500 fill-current" />
              <h1 className="text-3xl font-extrabold text-gray-900">Your Saved Favorites</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Quick access to your most-cherished dining spots and comfort meals
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('foods')}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'foods'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UtensilsCrossed size={14} />
            Favorite Dishes ({favDishes.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'restaurants'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Store size={14} />
            Favorite Kitchens ({favKitchens.length})
          </button>
        </div>

        {/* Content Tab 1: Favorite Dishes */}
        {activeTab === 'foods' && (
          <div>
            {favDishes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto p-8">
                <Heart size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">No saved dishes yet</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Tap the heart icon on any food item card across our menu to save it here for fast reordering.
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  <ShoppingBag size={14} />
                  Explore Dishes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favDishes.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Tab 2: Favorite Kitchens */}
        {activeTab === 'restaurants' && (
          <div>
            {favKitchens.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto p-8">
                <Store size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">No favorite restaurants yet</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Save your go-to dining places by clicking the heart button on restaurant cards.
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  <Store size={14} />
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favKitchens.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

