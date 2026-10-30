import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  UtensilsCrossed,
  MapPin,
  ChevronDown,
  User,
  Heart,
  Package,
  Sparkles,
  LogOut,
  Store,
  Shield,
  MessageSquareHeart,
  Compass,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Bandra West, Mumbai');

  const { cartCount } = useCart();
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/restaurants', label: 'Explore Restaurants', icon: Compass },
    { to: '/menu', label: 'Food Menu', icon: UtensilsCrossed },
    { to: '/recommendations', label: 'AI Pick', icon: Sparkles, badge: 'AI' },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/feedback', label: 'Feedback', icon: MessageSquareHeart },
  ];

  const addresses = [
    'Flat 402, Bandra West, Mumbai',
    'Tower 4, Horizon Tech Park, Andheri East, Mumbai',
    '12B, Palm Grove, Juhu, Mumbai',
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Brand + Location Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-2xl flex items-center justify-center shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
                <UtensilsCrossed size={20} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                FOOD<span className="text-[#FF6B35]">ORA</span>
              </span>
            </Link>

            {/* Address bar dropdown (Desktop) */}
            <div className="hidden lg:relative lg:block">
              <button
                onClick={() => setAddressSelectorOpen(!addressSelectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-orange-50/60 border border-transparent hover:border-orange-100 transition-all text-xs font-semibold text-gray-700 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                  <MapPin size={13} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block font-normal leading-none mb-0.5">
                    Deliver to
                  </span>
                  <span className="truncate max-w-[150px] block font-bold text-gray-800">
                    {selectedAddress}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {addressSelectorOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fadeIn">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">
                    Select Delivery Address
                  </p>
                  {addresses.map((addr) => (
                    <button
                      key={addr}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setAddressSelectorOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer ${
                        selectedAddress === addr
                          ? 'bg-orange-50 text-[#FF6B35] font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{addr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-orange-50 text-[#FF6B35]'
                      : 'text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50/40'
                  }`}
                >
                  {link.icon && <link.icon size={14} />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Cart + Profile / Auth */}
          <div className="flex items-center gap-3">
            {/* Quick dashboard switcher for Restaurant/Admin roles */}
            {role === 'restaurant' && (
              <Link
                to="/restaurant"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all"
              >
                <Store size={14} />
                Restaurant Portal
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all"
              >
                <Shield size={14} />
                Admin Portal
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-2xl bg-orange-50 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all shadow-xs cursor-pointer"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 cursor-pointer"
                >
                  <img
                    src={
                      currentUser?.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
                    }
                    alt={currentUser?.name || 'User'}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-orange-200"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-gray-800 max-w-[100px] truncate">
                    {currentUser?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fadeIn divide-y divide-gray-100">
                    <div className="px-3 py-2">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-[#FF6B35] rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Role: {role || 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] transition-all"
                      >
                        <User size={15} />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] transition-all"
                      >
                        <Package size={15} />
                        My Orders
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] transition-all"
                      >
                        <Heart size={15} />
                        Saved Favorites
                      </Link>

                      {/* Portals access */}
                      {role === 'restaurant' && (
                        <Link
                          to="/restaurant"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition-all"
                        >
                          <Store size={15} />
                          Restaurant Dashboard
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 transition-all"
                        >
                          <Shield size={15} />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-orange-200"
              >
                <User size={14} />
                Sign In
              </Link>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(link.to)
                  ? 'bg-orange-50 text-[#FF6B35]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {link.icon && <link.icon size={16} />}
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {role === 'restaurant' && (
            <Link
              to="/restaurant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-700 bg-amber-50"
            >
              <Store size={16} />
              Restaurant Dashboard
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50"
            >
              <Shield size={16} />
              Admin Portal
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
