import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, UtensilsCrossed, CheckCircle2, ArrowRight, ShieldCheck, Clock, MapPin, DollarSign } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function RestaurantRegister() {
  const { applyRestaurantRegistration } = usePlatform();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    cuisines: 'Indian, Mughlai',
    address: '',
    location: 'Bandra West, Mumbai',
    openingHours: '11:00 AM - 11:00 PM',
    deliveryTime: '25-35 min',
    minOrder: '150',
    costForTwo: '400',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdRest, setCreatedRest] = useState(null);

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cuisinesArray = form.cuisines
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newRest = applyRestaurantRegistration({
      ...form,
      cuisines: cuisinesArray,
    });

    setCreatedRest(newRest);
    setSubmitted(true);
    showToast('Restaurant registration submitted for admin approval!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              FOOD<span className="text-[#FF6B35]">ORA</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">Partner with FOODORA</h2>
          <p className="mt-1 text-sm text-gray-500">
            Expand your kitchen's reach, receive orders seamlessly, and grow your restaurant business
          </p>
        </div>

        {!submitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-orange-100/50 border border-gray-100">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 text-[#FF6B35]">
              <Store size={20} />
              <h3 className="font-bold text-gray-800 text-lg">Restaurant Onboarding Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Royal Curry Leaf"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Owner / Manager Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="e.g. Chef Vikram Joshi"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="e.g. info@royalcurryleaf.com"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Cuisines Offered (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={form.cuisines}
                  onChange={(e) => updateField('cuisines', e.target.value)}
                  placeholder="e.g. Indian, Tandoor, Biryani, Mughlai"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Location Area / Zone
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g. Bandra West, Mumbai"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={form.openingHours}
                    onChange={(e) => updateField('openingHours', e.target.value)}
                    placeholder="e.g. 11:00 AM - 11:00 PM"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Complete Kitchen & Outlet Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Shop / Unit number, street name, landmark, pin code"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Delivery Estimate
                  </label>
                  <input
                    type="text"
                    value={form.deliveryTime}
                    onChange={(e) => updateField('deliveryTime', e.target.value)}
                    placeholder="e.g. 30-40 min"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => updateField('minOrder', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Approx Cost for 2 (₹)
                  </label>
                  <input
                    type="number"
                    value={form.costForTwo}
                    onChange={(e) => updateField('costForTwo', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl text-xs text-gray-600">
                <span className="font-bold text-[#FF6B35]">Platform Partnership Note:</span> New
                restaurant registrations are initially created in{' '}
                <span className="font-bold font-mono">PENDING</span> status until verified and approved
                by the FOODORA administrator.
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-orange-200 cursor-pointer active:scale-98"
              >
                Submit Restaurant Registration
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={40} />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Registration Under Review
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-3">
                Application Received for "{createdRest?.name}"!
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
                Your restaurant registration has been submitted with reference ID{' '}
                <span className="font-mono font-bold text-[#FF6B35]">{createdRest?.id}</span>.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left max-w-md mx-auto text-xs space-y-2">
              <p className="font-bold text-gray-800 text-sm">💡 Hackathon Review Guide:</p>
              <p className="text-gray-600 leading-relaxed">
                You can now log in as the <span className="font-bold text-purple-700">Administrator</span>{' '}
                (<span className="font-mono">admin@foodora.com</span> / <span className="font-mono">demo123</span>) to review and approve this restaurant from the{' '}
                <span className="font-semibold text-gray-800">Admin Dashboard → Restaurant Approvals</span> queue!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to="/login"
                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                Go to Sign In
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all"
              >
                Return to Customer Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

