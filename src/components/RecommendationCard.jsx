import { Plus, Minus, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function RecommendationCard({ food }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden h-48">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Sparkles size={12} />
            AI Pick
          </span>
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {food.rating}
          </span>
          <span
            className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm ${
              food.isVeg ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1.5">{food.name}</h3>
          <p className="text-xs text-purple-700 bg-purple-50/80 border border-purple-100 px-3 py-2 rounded-xl mb-3 font-medium leading-relaxed">
            ✨ {food.matchReason}
          </p>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{food.description}</p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <div>
            <span className="text-xs text-gray-400 block">Price</span>
            <span className="text-xl font-bold text-[#FF6B35]">₹{food.price}</span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={() => addToCart(food)}
              className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-1 py-1">
              <button
                onClick={() => updateQuantity(food.id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-bold text-gray-800 text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(food.id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
