import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  UtensilsCrossed,
  LayoutDashboard,
  Store,
  BookOpen,
  PlusCircle,
  Bell,
  Clock,
  Package,
  Boxes,
  TrendingUp,
  MessageSquare,
  MessageSquareHeart,
  Settings,
  LogOut,
  Menu,
  X,
  Power,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';

export default function RestaurantLayout() {
  const { currentUser, logout } = useAuth();
  const { restaurants, toggleRestaurantOpenStatus } = usePlatform();
  const { orders } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Link to this restaurant (defaults to rest_1 for demo account)
  const myRestaurantId = currentUser?.restaurantId || 'rest_1';
  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === myRestaurantId) || restaurants[0],
    [restaurants, myRestaurantId]
  );

  // Pending incoming orders count
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.restaurantId === restaurant?.id &&
        (o.status === 'PLACED' || o.status === 'ACCEPTED' || o.status === 'PREPARING')
    ).length;
  }, [orders, restaurant?.id]);

  const navItems = [
    { to: '/restaurant', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    {
      to: '/restaurant/orders',
      label: 'Incoming Orders',
      icon: Clock,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-[#FF6B35]',
    },
    { to: '/restaurant/order-history', label: 'Order History', icon: Package },
    { to: '/restaurant/menu', label: 'Menu Management', icon: BookOpen },
    { to: '/restaurant/menu/add', label: 'Add Food Item', icon: PlusCircle },
    { to: '/restaurant/inventory', label: 'Inventory & Stock', icon: Boxes },
    { to: '/restaurant/analytics', label: 'Sales & Earnings', icon: TrendingUp },
    { to: '/restaurant/reviews', label: 'Customer Reviews', icon: MessageSquare },
    { to: '/restaurant/profile', label: 'Restaurant Profile', icon: Store },
    { to: '/restaurant/feedback', label: 'Contact Platform Admin', icon: MessageSquareHeart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900">FOODORA</span>
            <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-wider">
              Restaurant Partner
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Link to="/restaurant" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-xl flex items-center justify-center text-white shadow-md">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <span className="font-extrabold text-white tracking-tight text-base">
                    FOOD<span className="text-[#FF6B35]">ORA</span>
                  </span>
                  <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Kitchen Console
                  </span>
                </div>
              </Link>
            </div>

            {/* Restaurant Profile Mini Card in Sidebar */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-white truncate">
                  {restaurant?.name || 'My Kitchen'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{restaurant?.location}</p>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  restaurant?.isOpen ? 'bg-emerald-500 shadow-xs shadow-emerald-400' : 'bg-rose-500'
                }`}
                title={restaurant?.isOpen ? 'Kitchen Open' : 'Kitchen Closed'}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-none">
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-950/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${
                        item.badgeColor || 'bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Customer View Link */}
          <Link
            to={`/restaurants/${restaurant?.id || 'rest_1'}`}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-[#FF6B35]" />
              <span>Preview Live Menu</span>
            </div>
            <ChevronRight size={14} className="text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Restaurant Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                {restaurant?.name || 'Restaurant Management'}
              </h2>
              <span className="text-[11px] text-slate-400">
                Logged in as {currentUser?.name || 'Chef Partner'}
              </span>
            </div>
          </div>

          {/* Kitchen Open/Close Quick Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 pl-1 hidden sm:inline">
                Kitchen Status:
              </span>
              <button
                type="button"
                onClick={() => toggleRestaurantOpenStatus(restaurant?.id || 'rest_1')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  restaurant?.isOpen
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-rose-600 text-white shadow-2xs'
                }`}
              >
                <Power size={12} />
                {restaurant?.isOpen ? 'ONLINE / ACCEPTING' : 'OFFLINE / CLOSED'}
              </button>
            </div>

            <Link
              to="/restaurant/orders"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              title="Incoming Orders"
            >
              <Bell size={18} />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B35] rounded-full animate-pulse" />
              )}
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

