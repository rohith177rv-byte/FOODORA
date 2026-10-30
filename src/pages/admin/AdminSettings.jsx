import { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Shield,
  Percent,
  IndianRupee,
  Truck,
  FileText,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function AdminSettings() {
  const { platformSettings, updatePlatformSettings } = usePlatform();
  const { currentUser, changePassword } = useAuth();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    deliveryFee: platformSettings.deliveryFee || 30,
    freeDeliveryThreshold: platformSettings.freeDeliveryThreshold || 299,
    taxRate: (platformSettings.taxRate || 0.05) * 100, // as percentage for input
    platformCommissionRate: platformSettings.platformCommissionRate || 15,
    supportEmail: platformSettings.supportEmail || 'support@foodora.com',
    supportPhone: platformSettings.supportPhone || '+91 1800-FOODORA',
  });

  // Password Change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Reset State Modal
  const [resetModal, setResetModal] = useState(false);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();

    updatePlatformSettings({
      deliveryFee: Number(formData.deliveryFee),
      freeDeliveryThreshold: Number(formData.freeDeliveryThreshold),
      taxRate: Number(formData.taxRate) / 100,
      platformCommissionRate: Number(formData.platformCommissionRate),
      supportEmail: formData.supportEmail.trim(),
      supportPhone: formData.supportPhone.trim(),
    });

    showToast?.('Platform operational settings saved successfully!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast?.('New passwords do not match!', 'error');
      return;
    }

    try {
      changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast?.('Admin password updated successfully!', 'success');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err) {
      showToast?.(err.message || 'Failed to update password', 'error');
    }
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    showToast?.('Platform demo data reset to default factory state. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings & Controls</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure multi-vendor commission rates, delivery thresholds, taxation percentages, and system security.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSettingsSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-orange" />
          Financial & Operational Policies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gray-500" />
              Standard Delivery Fee (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">Applied to standard customer orders</span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.freeDeliveryThreshold}
              onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">Orders above this receive free delivery</span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-gray-500" />
              Platform Tax Rate (% GST)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="28"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">Standard restaurant GST (default 5%)</span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-brand-orange" />
              Default Platform Commission Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.platformCommissionRate}
              onChange={(e) => setFormData({ ...formData, platformCommissionRate: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">Charged on food item subtotal</span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Support Desk Email</label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Emergency Helpline Phone</label>
            <input
              type="text"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>

      {/* Security & Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-purple-600" />
          Admin Account Credentials
        </h2>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
            Password updated successfully. Remember your new password for subsequent logins!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Current Password *</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Confirm New Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            Update Admin Password
          </button>
        </div>
      </form>

      {/* Demo Reset Factory Data */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Reset Prototype Storage & Demo State
          </h3>
          <p className="text-xs text-red-700 mt-1">
            Clears all LocalStorage data and restores default food items, sample orders, demo restaurants, and initial coupons.
          </p>
        </div>
        <button
          onClick={() => setResetModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-sm"
        >
          Factory Reset Data
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModal && (
        <Modal
          isOpen={resetModal}
          onClose={() => setResetModal(false)}
          title="Confirm Platform Data Reset"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              Are you sure you want to reset all mock platform data? All simulated orders, customer ratings, and newly added food items will be returned to initial seed states.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetModal(false)}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                className="px-4 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-sm"
              >
                Reset All Local Data
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

