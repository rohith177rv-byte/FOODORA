import { AlertCircle } from 'lucide-react';
import Modal from './Modal.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';

export default function RestaurantConflictModal() {
  const { restaurantConflict, clearCartAndAdd, dismissConflict } = useCart();
  const { restaurants } = usePlatform();

  if (!restaurantConflict) return null;

  const currentRest = restaurants.find(
    (r) => r.id === restaurantConflict.currentRestaurantId
  );
  const newRest = restaurants.find(
    (r) => r.id === restaurantConflict.newRestaurantId
  );

  const currentName = currentRest ? currentRest.name : 'another restaurant';
  const newName = newRest ? newRest.name : 'this restaurant';

  return (
    <Modal
      isOpen={!!restaurantConflict}
      onClose={dismissConflict}
      title="Replace Cart Items?"
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-gray-700">
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your cart already contains items from{' '}
            <span className="font-bold text-gray-900">{currentName}</span>.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            FOODORA orders are delivered directly from a single kitchen. Would you like to discard
            your previous cart and start a fresh order from{' '}
            <span className="font-bold text-[#FF6B35]">{newName}</span>?
          </p>
        </div>

        <div className="bg-orange-50/60 border border-orange-100 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400 block">Item to add:</span>
            <span className="font-bold text-gray-800">
              {restaurantConflict.pendingFood.name}
            </span>
          </div>
          <span className="text-sm font-extrabold text-[#FF6B35]">
            ₹{restaurantConflict.pendingFood.price}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => clearCartAndAdd(restaurantConflict.pendingFood)}
            className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-orange-200 active:scale-98 cursor-pointer"
          >
            Clear Cart & Add
          </button>
          <button
            onClick={dismissConflict}
            className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

