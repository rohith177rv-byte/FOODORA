import { useState } from 'react';
import { Plus, Minus, Clock, Star, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { usePlatform } from '../context/PlatformContext.jsx';

export default function FoodCard({ food }) {
  const { addToCart, updateQuantity, getItemQuantity, isFavoriteFood, toggleFavoriteFood } = useCart();
  const { restaurants } = usePlatform();

  const [noteOpen, setNoteOpen] = useState(false);
  const [instructions, setInstructions] = useState('');

  const quantity = getItemQuantity(food.id);
  const isFav = isFavoriteFood(food.id);

  const restaurant = restaurants.find((r) => r.id === food.restaurantId);
  const isOutOfStock = food.isAvailable === false || (typeof food.stockQuantity === 'number' && food.stockQuantity <= 0);

  const handleAddWithInstructions = () => {
    addToCart(food, instructions);
    setNoteOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col justify-between">
      <div>
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-gray-100">
          <img
            src={food.image}
            alt={food.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
            loading="lazy"
          />

          {/* Veg/Non-Veg Badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
              food.isVeg ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>

          {/* Favorite heart toggle */}
          <button
            onClick={() => toggleFavoriteFood(food.id)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isFav
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-xs'
            }`}
          >
            <Heart size={14} className={isFav ? 'fill-current' : ''} />
          </button>

          {/* Rating Badge */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold text-gray-800 shadow-xs">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {food.rating || 4.5}
          </span>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-base text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
              {food.name}
            </h3>
          </div>

          {restaurant && (
            <p className="text-[11px] font-semibold text-gray-400 mb-1.5 line-clamp-1">
              by <span className="text-gray-600 hover:underline">{restaurant.name}</span>
            </p>
          )}

          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {food.prepTime}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-orange-50 text-[#FF6B35] rounded-lg font-medium text-[11px]">
              {food.category}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Price & Add */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <div>
            <span className="text-lg font-extrabold text-[#FF6B35]">₹{food.price}</span>
          </div>

          {isOutOfStock ? (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
              Unavailable
            </span>
          ) : quantity === 0 ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setNoteOpen(!noteOpen)}
                title="Add custom instructions"
                className="p-2 text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 rounded-xl transition-all cursor-pointer"
              >
                <MessageSquare size={15} />
              </button>
              <button
                onClick={() => addToCart(food)}
                className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 active:scale-95 cursor-pointer"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-1 py-1">
              <button
                onClick={() => updateQuantity(food.id, quantity - 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-200 shadow-xs cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span className="w-5 text-center font-bold text-gray-800 text-xs">{quantity}</span>
              <button
                onClick={() => updateQuantity(food.id, quantity + 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-200 shadow-xs cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Custom Instructions inline popover */}
        {noteOpen && !isOutOfStock && (
          <div className="mt-3 p-2.5 bg-orange-50/70 rounded-xl border border-orange-100 text-xs space-y-2">
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra sauce"
              className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setNoteOpen(false)}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWithInstructions}
                className="px-2.5 py-1 bg-[#FF6B35] text-white rounded-lg font-bold"
              >
                Add with Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
