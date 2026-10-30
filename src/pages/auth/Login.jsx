import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, Lock, Mail, UserCheck, Shield, Store, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'restaurant') {
        navigate('/restaurant', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click demo filler
  const fillDemoAccount = (role) => {
    if (role === 'customer') {
      setEmail('customer@foodora.com');
      setPassword('demo123');
    } else if (role === 'restaurant') {
      setEmail('restaurant@foodora.com');
      setPassword('demo123');
    } else if (role === 'admin') {
      setEmail('admin@foodora.com');
      setPassword('demo123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              FOOD<span className="text-[#FF6B35]">ORA</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select your role or enter credentials to access your dashboard
          </p>
        </div>

        {/* Demo Role Selector Bar */}
        <div className="mt-6 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
            Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                email === 'customer@foodora.com'
                  ? 'bg-orange-50 text-[#FF6B35] border border-orange-200 shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserCheck size={16} />
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('restaurant')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                email === 'restaurant@foodora.com'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Store size={16} />
              Restaurant
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                email === 'admin@foodora.com'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield size={16} />
              Admin
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-orange-100/50 rounded-3xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Email Address or Phone
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@foodora.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#FF6B35] font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo password: demo123"
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#FF6B35] focus:ring-[#FF6B35] h-4 w-4"
                />
                <span className="text-xs text-gray-600 font-medium">Remember my session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-orange-200 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-center text-xs text-gray-600">
            <p>
              New hungry foodie?{' '}
              <Link to="/register" className="text-[#FF6B35] font-bold hover:underline">
                Create Customer Account
              </Link>
            </p>
            <p>
              Restaurant owner?{' '}
              <Link to="/restaurant-register" className="text-amber-600 font-bold hover:underline">
                Partner with FOODORA
              </Link>
            </p>
          </div>
        </div>

        {/* Credentials cheat-sheet for demo judges */}
        <div className="mt-6 bg-orange-50/70 border border-orange-200/60 p-4 rounded-2xl text-xs text-gray-600">
          <p className="font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
            🔑 Hackathon Demo Credentials
          </p>
          <ul className="space-y-1 font-mono text-[11px] text-gray-700">
            <li>• Customer: customer@foodora.com / demo123</li>
            <li>• Restaurant: restaurant@foodora.com / demo123</li>
            <li>• Admin: admin@foodora.com / demo123</li>
          </ul>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Reset Demo Password</h3>
            <p className="text-xs text-gray-500">
              Enter your registered email address and we'll send demo password recovery instructions.
            </p>
            {forgotSent ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
                Demo reset link dispatched! In demo mode, your password remains <span className="font-mono font-bold">demo123</span>.
              </div>
            ) : (
              <div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {!forgotSent ? (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="flex-1 bg-[#FF6B35] text-white py-2.5 rounded-xl text-xs font-bold"
                >
                  Send Reset Link
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

