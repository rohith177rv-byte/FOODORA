import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  CheckSquare,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  UtensilsCrossed,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { restaurants, complaints } = usePlatform();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Pending restaurant approvals count
  const pendingApprovalsCount = restaurants.filter((r) => r.status === 'PENDING').length;
  // Pending support tickets count
  const pendingTicketsCount = complaints.filter((c) => c.status === 'PENDING').length;

  const navLinks = [
    { to: '/admin', label: 'Platform Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/restaurants', label: 'Restaurants', icon: Store },
    {
      to: '/admin/approvals',
      label: 'Partner Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-500',
    },
    { to: '/admin/orders', label: 'Order Management', icon: ShoppingBag },
    { to: '/admin/payments', label: 'Payments & Refunds', icon: CreditCard },
    {
      to: '/admin/feedback',
      label: 'Complaints & Support',
      icon: MessageSquare,
      badge: pendingTicketsCount > 0 ? pendingTicketsCount : null,
      badgeColor: 'bg-red-500',
    },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/promotions', label: 'Coupons & Promos', icon: Tag },
    { to: '/admin/settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-black text-white text-lg">
              F
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white">FOODORA</span>
              <span className="text-[10px] block font-semibold text-brand-orange uppercase tracking-widest">
                Operations HQ
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tag */}
        <div className="p-4 mx-4 mt-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-brand-orange flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'admin@foodora.com'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${link.badgeColor}`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Customer Portal Link & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Visit Customer App</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-gray-700">Platform Online</span>
              <span className="hidden sm:inline text-gray-400">•</span>
              <span className="hidden sm:inline">Active Orders: {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {pendingApprovalsCount > 0 && (
              <NavLink
                to="/admin/approvals"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{pendingApprovalsCount} Partner Application{pendingApprovalsCount > 1 ? 's' : ''} Pending</span>
              </NavLink>
            )}

            <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

