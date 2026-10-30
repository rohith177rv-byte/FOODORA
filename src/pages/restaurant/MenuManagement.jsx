import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Power,
  Clock,
  Star,
  Eye,
} from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function MenuManagement() {
  const { currentUser } = useAuth();
  const { foods, updateFoodItem, deleteFoodItem, toggleFoodAvailability } = usePlatform();
  const { showToast } = useCart();

  const myRestId = currentUser?.restaurantId || 'rest_1';

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dietFilter, setDietFilter] = useState('all');

  // Edit dish modal state
  const [editingFood, setEditingFood] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category: '',
    prepTime: '',
    description: '',
    isVeg: true,
    image: '',
    isAvailable: true,
  });

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Dishes for this kitchen
  const myFoods = useMemo(
    () => foods.filter((f) => f.restaurantId === myRestId),
    [foods, myRestId]
  );

  const availableCategories = useMemo(() => {
    const cats = new Set(myFoods.map((f) => f.category));
    return ['All', ...Array.from(cats)];
  }, [myFoods]);

  const filteredFoods = useMemo(() => {
    let result = [...myFoods];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((f) => f.category === categoryFilter);
    }

    if (dietFilter === 'veg') {
      result = result.filter((f) => f.isVeg);
    } else if (dietFilter === 'nonveg') {
      result = result.filter((f) => !f.isVeg);
    }

    return result;
  }, [myFoods, search, categoryFilter, dietFilter]);

  const openEditModal = (food) => {
    setEditingFood(food);
    setEditForm({
      name: food.name,
      price: food.price,
      category: food.category,
      prepTime: food.prepTime || '20 min',
      description: food.description || '',
      isVeg: food.isVeg,
      image: food.image,
      isAvailable: food.isAvailable !== false,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFood) return;

    updateFoodItem(editingFood.id, {
      ...editForm,
      price: Number(editForm.price),
    });

    setEditingFood(null);
    showToast(`Updated ${editForm.name} details! Live on customer menu.`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteFoodItem(deletingId);
    setDeletingId(null);
    showToast('Food item removed from menu.', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Menu Catalog
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Food Menu Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit dishes, update prices, manage daily availability and dietary tags
          </p>
        </div>

        <Link
          to="/restaurant/menu/add"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
        >
          <PlusCircle size={15} />
          Add New Dish
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF6B35]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6B35]"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6B35]"
          >
            <option value="all">Diet: All</option>
            <option value="veg">Veg Only 🟢</option>
            <option value="nonveg">Non-Veg 🔴</option>
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredFoods.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No dishes match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3.5 px-5">Dish</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Prep Time</th>
                  <th className="py-3.5 px-5">Diet</th>
                  <th className="py-3.5 px-5">Availability</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredFoods.map((food) => {
                  const isAvailable = food.isAvailable !== false;

                  return (
                    <tr key={food.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={food.image}
                            alt={food.name}
                            className={`w-11 h-11 rounded-xl object-cover shrink-0 ${
                              !isAvailable ? 'grayscale opacity-60' : ''
                            }`}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{food.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {food.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px]">
                          {food.category}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-black text-slate-900 whitespace-nowrap">
                        ₹{food.price}
                      </td>
                      <td className="py-3 px-5 whitespace-nowrap text-slate-500">
                        {food.prepTime || '20 min'}
                      </td>
                      <td className="py-3 px-5 whitespace-nowrap">
                        {food.isVeg ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            🟢 Veg
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            🔴 Non-Veg
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleFoodAvailability(food.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(food)}
                            className="p-1.5 text-slate-500 hover:text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit dish"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingId(food.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete dish"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Food Item Modal */}
      <Modal
        isOpen={!!editingFood}
        onClose={() => setEditingFood(null)}
        title="Edit Dish Information"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Dish Name
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Estimated Prep Time
            </label>
            <input
              type="text"
              value={editForm.prepTime}
              onChange={(e) => setEditForm({ ...editForm, prepTime: e.target.value })}
              placeholder="e.g. 20 min"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Food Image URL
            </label>
            <input
              type="url"
              value={editForm.image}
              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isVeg}
                onChange={(e) => setEditForm({ ...editForm, isVeg: e.target.checked })}
                className="rounded text-emerald-600 h-4 w-4"
              />
              <span className="font-bold text-slate-700">Vegetarian 🟢</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isAvailable}
                onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                className="rounded text-[#FF6B35] h-4 w-4"
              />
              <span className="font-bold text-slate-700">Currently in Stock</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingFood(null)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Food Item"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to permanently remove this dish from your kitchen's menu?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Delete Dish
            </button>
            <button
              onClick={() => setDeletingId(null)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

