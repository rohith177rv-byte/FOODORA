import { Link } from 'react-router-dom';
import { Star, Clock, Heart, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function RestaurantCard({ restaurant }) {
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useCart();
  const isFav = isFavoriteRestaurant(restaurant.id);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between">
      <div>
        {/* Banner / Image */}
        <div className="relative overflow-hidden h-48 bg-gray-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteRestaurant(restaurant.id);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isFav
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-sm'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} className={isFav ? 'fill-current' : ''} />
          </button>

          {/* Open / Closed Status Pill */}
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
              restaurant.isOpen ? 'bg-emerald-600' : 'bg-gray-800/80 backdrop-blur-xs'
            }`}
          >
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </span>

          {/* Delivery Time Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-gray-800 shadow-sm">
            <Clock size={13} className="text-[#FF6B35]" />
            {restaurant.deliveryTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-lg text-xs shrink-0 border border-green-200">
              <Star size={12} className="fill-current text-green-600" />
              {restaurant.rating || '4.5'}
            </span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {restaurant.cuisines?.join(' • ')}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>Min order: ₹{restaurant.minOrder}</span>
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="text-[#FF6B35] font-bold hover:underline flex items-center gap-1"
          >
            View Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}

