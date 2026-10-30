import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, UtensilsCrossed, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function AddFoodItem() {
  const { currentUser } = useAuth();
  const { addFoodItem } = usePlatform();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const myRestId = currentUser?.restaurantId || 'rest_1';

  const [form, setForm] = useState({
    name: '',
    category: 'Indian',
    price: '',
    prepTime: '20 min',
    description: '',
    isVeg: true,
    taste: 'Spicy',
    mealType: ['Lunch', 'Dinner'],
    stockQuantity: '40',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    isPopular: false,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const toggleMealType = (type) => {
    setForm((prev) => {
      const exists = prev.mealType.includes(type);
      if (exists) {
        return { ...prev, mealType: prev.mealType.filter((t) => t !== type) };
      } else {
        return { ...prev, mealType: [...prev.mealType, type] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    setLoading(true);

    const newFood = addFoodItem({
      ...form,
      restaurantId: myRestId,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity) || 30,
      isAvailable: true,
      rating: 4.6,
    });

    showToast(`Added ${newFood.name} to kitchen menu! Visible to customers.`, 'success');
    navigate('/restaurant/menu');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/restaurant/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF6B35]"
        >
          <ChevronLeft size={16} />
          Back to Menu Management
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Menu Authoring
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Add New Food Dish</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish a new delicacy to your customer-facing digital menu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Dish Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Kashmiri Dum Aloo"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Cuisine / Food Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#FF6B35]"
              >
                <option value="Indian">Indian 🍛</option>
                <option value="Chinese">Chinese 🥡</option>
                <option value="Italian">Italian 🍝</option>
                <option value="Fast Food">Fast Food 🍔</option>
                <option value="Desserts">Desserts 🍰</option>
                <option value="Beverages">Beverages ☕</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Price in INR (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="e.g. 180"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Prep Time
              </label>
              <input
                type="text"
                value={form.prepTime}
                onChange={(e) => updateField('prepTime', e.target.value)}
                placeholder="e.g. 20 min"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Daily Stock Quantity
              </label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => updateField('stockQuantity', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Dish Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Highlight ingredients, flavor notes, cooking style..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35] resize-none"
            />
          </div>

          {/* Dietary & AI Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                Dietary Type
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="diet"
                    checked={form.isVeg}
                    onChange={() => updateField('isVeg', true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">🟢 Vegetarian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="diet"
                    checked={!form.isVeg}
                    onChange={() => updateField('isVeg', false)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-bold text-slate-800">🔴 Non-Vegetarian</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                Dominant Flavor Profile (for AI Recs)
              </label>
              <select
                value={form.taste}
                onChange={(e) => updateField('taste', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold"
              >
                <option value="Spicy">Spicy 🌶️</option>
                <option value="Mild">Mild 🌿</option>
                <option value="Sweet">Sweet 🍯</option>
                <option value="Healthy">Healthy 🥗</option>
              </select>
            </div>
          </div>

          {/* Meal Type Tags */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
              Meal Service Timings
            </label>
            <div className="flex flex-wrap gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMealType(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    form.mealType.includes(m)
                      ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {form.mealType.includes(m) ? `✓ ${m}` : m}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              High-Resolution Food Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => updateField('image', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-bold text-xs shadow-md hover:shadow-orange-200 transition-all cursor-pointer"
            >
              Publish Food Dish to Menu
            </button>
            <Link
              to="/restaurant/menu"
              className="px-6 py-3.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

