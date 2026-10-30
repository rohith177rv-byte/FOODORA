import { useState } from 'react';
import { Store, MapPin, Phone, Clock, DollarSign, Image as ImageIcon, Power, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function RestaurantProfile() {
  const { currentUser } = useAuth();
  const { restaurants, updateRestaurantProfile } = usePlatform();
  const { showToast } = useCart();

  const myRestId = currentUser?.restaurantId || 'rest_1';
  const restaurant = restaurants.find((r) => r.id === myRestId) || restaurants[0];

  const [form, setForm] = useState({
    name: restaurant?.name || 'Spice Symphony',
    tagline: restaurant?.tagline || 'Authentic Indian flavors crafted with heritage recipes',
    ownerName: restaurant?.ownerName || 'Chef Rajesh Khanna',
    phone: restaurant?.phone || '9823456789',
    cuisines: restaurant?.cuisines?.join(', ') || 'Indian, Mughlai, Biryani',
    address: restaurant?.address || '14, Hill Road, Bandra West, Mumbai 400050',
    location: restaurant?.location || 'Bandra West, Mumbai',
    openingHours: restaurant?.openingHours || '11:00 AM - 11:30 PM',
    deliveryTime: restaurant?.deliveryTime || '25-35 min',
    minOrder: String(restaurant?.minOrder || 150),
    costForTwo: String(restaurant?.costForTwo || 450),
    image: restaurant?.image || '',
    banner: restaurant?.banner || '',
    isOpen: restaurant?.isOpen !== false,
  });

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cuisinesArr = form.cuisines
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateRestaurantProfile(restaurant.id, {
      ...form,
      cuisines: cuisinesArr,
      minOrder: Number(form.minOrder),
      costForTwo: Number(form.costForTwo),
    });

    showToast('Kitchen profile updated! Immediately synced with customer portal.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Brand Identity
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Kitchen Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update your public restaurant page, operating hours, and delivery radius details
          </p>
        </div>

        <a
          href={`/restaurants/${restaurant.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          <Eye size={14} className="text-[#FF6B35]" />
          View Live Customer Page
        </a>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Status Switch */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">Accepting New Orders</p>
              <p className="text-slate-500 text-xs">
                Toggle offline when your kitchen is closed, cleaning, or out of staff
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateField('isOpen', !form.isOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                form.isOpen
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-rose-600 text-white shadow-2xs'
              }`}
            >
              {form.isOpen ? 'ONLINE (ACCEPTING)' : 'OFFLINE (CLOSED)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Restaurant Public Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Head Chef / Owner Name
              </label>
              <input
                type="text"
                required
                value={form.ownerName}
                onChange={(e) => updateField('ownerName', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Tagline / Catchphrase
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Cuisines (comma separated)
              </label>
              <input
                type="text"
                value={form.cuisines}
                onChange={(e) => updateField('cuisines', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Delivery Estimate
              </label>
              <input
                type="text"
                value={form.deliveryTime}
                onChange={(e) => updateField('deliveryTime', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Minimum Order (₹)
              </label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => updateField('minOrder', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Cost for Two (₹)
              </label>
              <input
                type="number"
                value={form.costForTwo}
                onChange={(e) => updateField('costForTwo', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Area / City Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Opening Hours
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => updateField('openingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Full Physical Address
            </label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Profile Thumbnail Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField('image', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                Wide Banner Image URL
              </label>
              <input
                type="url"
                value={form.banner}
                onChange={(e) => updateField('banner', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

