import { useState, useMemo } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function RestaurantApprovals() {
  const { restaurants, approveRestaurant, rejectRestaurant } = usePlatform();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'DECIDED'
  const [rejectModal, setRejectModal] = useState({ open: false, restaurant: null });
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingRestaurants = useMemo(
    () => restaurants.filter((r) => r.status === 'PENDING'),
    [restaurants]
  );

  const decidedRestaurants = useMemo(
    () => restaurants.filter((r) => r.status === 'ACTIVE' || r.status === 'REJECTED'),
    [restaurants]
  );

  const handleApprove = (rest) => {
    approveRestaurant(rest.id);
    showToast?.(`Approved ${rest.name}! Kitchen is now live on FOODORA platform.`, 'success');
  };

  const openRejectModal = (rest) => {
    setRejectModal({ open: true, restaurant: rest });
    setRejectionReason('Insufficient kitchen hygiene certifications or incomplete address verification.');
  };

  const handleConfirmReject = () => {
    if (!rejectModal.restaurant) return;
    rejectRestaurant(rejectModal.restaurant.id, rejectionReason);
    showToast?.(`Application for ${rejectModal.restaurant.name} rejected.`, 'warning');
    setRejectModal({ open: false, restaurant: null });
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partner Onboarding Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review commercial food licenses, kitchen location, and approve new restaurant partner registrations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Pending Review</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
            {pendingRestaurants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('DECIDED')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'DECIDED'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Processed Applications</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {decidedRestaurants.length}
          </span>
        </button>
      </div>

      {/* Pending Applications List */}
      {activeTab === 'PENDING' ? (
        pendingRestaurants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-xs text-gray-400 mt-1">
              There are no pending restaurant onboarding requests in the queue right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 hover:border-brand-orange transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{rest.name}</h3>
                        <StatusBadge status={rest.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{rest.tagline}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-gray-400" />
                          Owner: <strong>{rest.ownerName}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {rest.ownerEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {rest.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {rest.address}, {rest.location}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-500">Cuisines:</span>
                        {rest.cuisines?.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col lg:flex-row items-center gap-3 shrink-0">
                    <button
                      onClick={() => openRejectModal(rest)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(rest)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Launch Kitchen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Processed / Decided Applications */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Owner & Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {decidedRestaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-bold text-gray-900">{rest.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{rest.ownerName}</p>
                    <p className="text-[11px] text-gray-400">{rest.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{rest.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rest.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {rest.rejectionReason || (rest.status === 'ACTIVE' ? 'Approved by Admin' : 'None')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <Modal
          isOpen={rejectModal.open}
          onClose={() => setRejectModal({ open: false, restaurant: null })}
          title={`Reject Application: ${rejectModal.restaurant?.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              Please specify the operational reason for rejecting this restaurant partner onboarding application. The reason will be logged on the platform.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Rejection Reason *</label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, restaurant: null })}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

