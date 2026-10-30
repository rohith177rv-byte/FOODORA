import { useState, useMemo } from 'react';
import { Boxes, AlertTriangle, CheckCircle, Search, Plus, Minus, Power } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function InventoryAvailability() {
  const { currentUser } = useAuth();
  const { foods, updateFoodStock, toggleFoodAvailability } = usePlatform();
  const { showToast } = useCart();

  const myRestId = currentUser?.restaurantId || 'rest_1';

  const [search, setSearch] = useState('');

  const myFoods = useMemo(
    () => foods.filter((f) => f.restaurantId === myRestId),
    [foods, myRestId]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return myFoods;
    const q = search.toLowerCase();
    return myFoods.filter((f) => f.name.toLowerCase().includes(q));
  }, [myFoods, search]);

  const lowStockCount = myFoods.filter(
    (f) => typeof f.stockQuantity === 'number' && f.stockQuantity <= 10 && f.stockQuantity > 0
  ).length;

  const outOfStockCount = myFoods.filter(
    (f) => f.isAvailable === false || f.stockQuantity === 0
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Kitchen Stock Room
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily availability management to prevent customer order cancellations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-xl flex items-center gap-1.5">
              <AlertTriangle size={14} />
              {lowStockCount} Low Stock
            </span>
          )}
          {outOfStockCount > 0 && (
            <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl">
              {outOfStockCount} Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter inventory dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#FF6B35]"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-5">Dish</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Current Stock</th>
                <th className="py-3.5 px-5">Quick Adjust</th>
                <th className="py-3.5 px-5">Orderable Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((food) => {
                const stock = typeof food.stockQuantity === 'number' ? food.stockQuantity : 30;
                const isAvailable = food.isAvailable !== false && stock > 0;
                const isLow = stock <= 10 && stock > 0;

                return (
                  <tr key={food.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{food.name}</p>
                          <p className="text-[11px] text-slate-400">₹{food.price}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">
                        {food.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{stock}</span>
                        <span className="text-slate-400 text-[11px]">portions</span>
                        {isLow && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold text-[10px] rounded-full">
                            Low Stock
                          </span>
                        )}
                        {stock === 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded-full">
                            Depleted
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateFoodStock(food.id, stock - 5)}
                          disabled={stock <= 0}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer"
                          title="Decrease by 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateFoodStock(food.id, stock - 1)}
                          disabled={stock <= 0}
                          className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer disabled:opacity-40"
                        >
                          <Minus size={13} />
                        </button>
                        <button
                          onClick={() => updateFoodStock(food.id, stock + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer"
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          onClick={() => updateFoodStock(food.id, stock + 10)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                          title="Restock 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => toggleFoodAvailability(food.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        <Power size={11} />
                        {isAvailable ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

