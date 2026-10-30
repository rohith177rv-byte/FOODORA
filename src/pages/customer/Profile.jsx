import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  Star,
  MessageSquare,
} from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Profile() {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const { reviews } = usePlatform();
  const { showToast } = useCart();
  const navigate = useNavigate();

  // Edit profile state
  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '9876543210');
  const [isEditing, setIsEditing] = useState(false);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ title: 'Home', address: '', landmark: '' });

  // Change password state
  const [passForm, setPassForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Filter reviews by this customer
  const myReviews = reviews.filter(
    (r) => r.customerId === currentUser?.id || r.customerName === currentUser?.name
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setIsEditing(false);
    showToast('Profile information updated!', 'success');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.address.trim()) return;

    const existingAddresses = currentUser?.addresses || [];
    const created = {
      id: `addr_${Date.now()}`,
      title: newAddr.title,
      address: newAddr.address.trim(),
      landmark: newAddr.landmark.trim(),
      isDefault: existingAddresses.length === 0,
    };

    updateProfile({ addresses: [...existingAddresses, created] });
    setNewAddr({ title: 'Home', address: '', landmark: '' });
    setAddressModalOpen(false);
    showToast('New delivery address saved!', 'success');
  };

  const handleDeleteAddress = (id) => {
    const nextAddresses = (currentUser?.addresses || []).filter((a) => a.id !== id);
    updateProfile({ addresses: nextAddresses });
    showToast('Address removed', 'info');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (passForm.newPass.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    try {
      changePassword(passForm.currentPass, passForm.newPass);
      setPassSuccess(true);
      setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
      showToast('Password updated successfully!', 'success');
    } catch (err) {
      setPassError(err.message || 'Current password is incorrect');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
              }
              alt={currentUser?.name || 'User'}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-100 shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{currentUser?.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 bg-orange-100 text-[#FF6B35] rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Role: {currentUser?.role || 'Customer'}
                </span>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Status: {currentUser?.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Personal Information</h3>
              <p className="text-xs text-gray-400">Manage your name and phone number for delivery</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#FF6B35] hover:underline cursor-pointer"
              >
                Edit Details
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="block font-bold text-gray-600 uppercase tracking-wider text-[10px] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 uppercase tracking-wider text-[10px] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6B35] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                  Full Name
                </span>
                <span className="font-semibold text-gray-800">{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                  Email Address
                </span>
                <span className="font-semibold text-gray-800">{currentUser?.email}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                  Mobile Number
                </span>
                <span className="font-semibold text-gray-800">+91 {currentUser?.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Saved Delivery Addresses */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Saved Delivery Addresses</h3>
              <p className="text-xs text-gray-400">Quickly select addresses when checking out</p>
            </div>
            <button
              onClick={() => setAddressModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF6B35] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus size={14} />
              Add Address
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {(currentUser?.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/40 relative space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#FF6B35]" />
                    {addr.title}
                  </span>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-gray-600 leading-relaxed pr-6">{addr.address}</p>
                {addr.landmark && (
                  <p className="text-gray-400 text-[11px]">Landmark: {addr.landmark}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Demo Change Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="pb-4 border-b border-gray-100 mb-6">
            <h3 className="font-extrabold text-base text-gray-900">Security & Password</h3>
            <p className="text-xs text-gray-400">
              Demo password management (Default initial password is <span className="font-mono font-bold">demo123</span>)
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
            {passError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
                {passError}
              </div>
            )}
            {passSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                Password updated successfully!
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-600 uppercase tracking-wider text-[10px] mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passForm.currentPass}
                onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-600 uppercase tracking-wider text-[10px] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passForm.newPass}
                onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-600 uppercase tracking-wider text-[10px] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passForm.confirmPass}
                onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 hover:bg-[#FF6B35] text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Section 4: My Submitted Reviews & Ratings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="pb-4 border-b border-gray-100 mb-6">
            <h3 className="font-extrabold text-base text-gray-900">My Food Reviews & Feedback</h3>
            <p className="text-xs text-gray-400">Ratings and reviews you submitted for past meals</p>
          </div>

          {myReviews.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">
              You haven't reviewed any completed orders yet.
            </p>
          ) : (
            <div className="space-y-3">
              {myReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{rev.restaurantName}</span>
                    <span className="text-yellow-600 font-bold flex items-center gap-1">
                      <Star size={13} className="fill-current" />
                      {rev.rating} ★
                    </span>
                  </div>
                  <p className="text-gray-600 italic">"{rev.comment}"</p>
                  {rev.restaurantResponse && (
                    <div className="p-2.5 bg-orange-50 rounded-xl text-[11px] text-[#FF6B35]">
                      <span className="font-bold">Kitchen Reply:</span> {rev.restaurantResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add New Delivery Address"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-600 uppercase text-[10px] mb-1">
              Address Label
            </label>
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewAddr({ ...newAddr, title: t })}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    newAddr.title === t
                      ? 'bg-orange-100 text-[#FF6B35] border border-orange-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-600 uppercase text-[10px] mb-1">
              Full Street Address
            </label>
            <textarea
              rows={2}
              required
              value={newAddr.address}
              onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
              placeholder="Flat no., building, road, area, pincode"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35] resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-600 uppercase text-[10px] mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={newAddr.landmark}
              onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
              placeholder="e.g. Opposite Metro Gate 2"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#FF6B35] text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

