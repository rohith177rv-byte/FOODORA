import { Plus, Minus, Clock, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function FoodCard({ food }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Veg/Non-Veg Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
            food.isVeg ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
        {/* Rating Badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {food.rating}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{food.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{food.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {food.prepTime}
          </span>
          <span className="px-2 py-0.5 bg-orange-50 text-[#FF6B35] rounded-full font-medium">
            {food.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#FF6B35]">₹{food.price}</span>

          {quantity === 0 ? (
            <button
              onClick={() => addToCart(food)}
              className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 active:scale-95"
            >
              <Plus size={16} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-1 py-1">
              <button
                onClick={() => updateQuantity(food.id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-200 shadow-sm"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
              <button
                onClick={() => updateQuantity(food.id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-200 shadow-sm"
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
