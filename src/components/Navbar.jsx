import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Explore Menu' },
    { to: '/recommendations', label: 'AI Recommendations' },
    { to: '/orders', label: 'My Orders' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-800 tracking-tight">
              FOOD<span className="text-[#FF6B35]">ORA</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? 'bg-orange-50 text-[#FF6B35]'
                    : 'text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-orange-50 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-300"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-80 border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'bg-orange-50 text-[#FF6B35]'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
