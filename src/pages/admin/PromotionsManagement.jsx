import { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Calendar,
  Percent,
  IndianRupee,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function PromotionsManagement() {
  const { promotions, addPromotion, togglePromotion, deletePromotion } = usePlatform();
  const { showToast } = useCart();

  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE', // 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY'
    discountValue: 20,
    minOrderValue: 299,
    maxDiscount: 100,
    description: '',
    expiryDate: '2026-12-31',
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    addPromotion({
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscount: Number(formData.maxDiscount) || null,
      description: formData.description.trim() || `Get discounts with ${formData.code.toUpperCase()}`,
      expiryDate: formData.expiryDate,
    });

    showToast?.(`Coupon code ${formData.code.toUpperCase()} created successfully!`, 'success');
    setCreateModal(false);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 299,
      maxDiscount: 100,
      description: '',
      expiryDate: '2026-12-31',
    });
  };

  const handleToggle = (promo) => {
    togglePromotion(promo.id);
    showToast?.(
      `Coupon ${promo.code} is now ${promo.isActive ? 'INACTIVE' : 'ACTIVE'}`,
      'info'
    );
  };

  const handleDelete = (promo) => {
    if (confirm(`Delete coupon code ${promo.code}?`)) {
      deletePromotion(promo.id);
      showToast?.(`Coupon ${promo.code} deleted.`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons & Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create discount vouchers, free delivery codes, and manage active promotional campaigns.
          </p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-xl border p-5 transition-all shadow-sm relative flex flex-col justify-between ${
              promo.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-extrabold px-3 py-1 bg-orange-50 text-brand-orange border border-dashed border-brand-orange rounded-md tracking-wider">
                  {promo.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-800 mb-1">{promo.description}</p>
              <p className="text-xs text-gray-500">
                {promo.discountType === 'PERCENTAGE'
                  ? `${promo.discountValue}% OFF (up to ₹${promo.maxDiscount || 'unlimited'})`
                  : promo.discountType === 'FIXED'
                  ? `Flat ₹${promo.discountValue} OFF`
                  : 'Free Express Delivery'}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Min Order: ₹{promo.minOrderValue}</span>
                <span>Expires: {promo.expiryDate || 'Ongoing'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleToggle(promo)}
                className={`text-xs font-bold px-3 py-1 rounded transition-colors cursor-pointer ${
                  promo.isActive
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                {promo.isActive ? 'Pause' : 'Activate'}
              </button>

              <button
                onClick={() => handleDelete(promo)}
                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Delete Promotion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {createModal && (
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="Create New Coupon Voucher"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                placeholder="e.g., SUMMER50"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Flat Discount (₹)</option>
                  <option value="FREE_DELIVERY">Free Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {formData.discountType === 'PERCENTAGE' ? 'Discount %' : 'Discount Amount (₹)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g., Flat 20% off on all weekend meal orders"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateModal(false)}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg cursor-pointer shadow-sm"
              >
                Launch Coupon
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

