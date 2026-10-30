import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">₹{item.price} each</p>
        <p className="text-[#FF6B35] font-bold mt-1">₹{item.price * item.quantity}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-1 py-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
