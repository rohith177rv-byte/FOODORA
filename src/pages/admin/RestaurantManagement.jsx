import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function RestaurantManagement() {
  const {
    restaurants,
    foods,
    suspendRestaurant,
    activateRestaurant,
    updateRestaurantProfile,
  } = usePlatform();
  const { showToast } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRest, setSelectedRest] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, restaurant: null });

  // Filtered Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.cuisines && r.cuisines.join(' ').toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModal.restaurant) return;

    updateRestaurantProfile(editModal.restaurant.id, {
      name: editModal.restaurant.name,
      commissionRate: Number(editModal.restaurant.commissionRate) || 15,
      deliveryTime: editModal.restaurant.deliveryTime,
      minOrder: Number(editModal.restaurant.minOrder) || 150,
      phone: editModal.restaurant.phone,
      address: editModal.restaurant.address,
      status: editModal.restaurant.status,
    });

    showToast?.(`Restaurant ${editModal.restaurant.name} updated successfully!`, 'success');
    setEditModal({ open: false, restaurant: null });
  };

  const handleToggleSuspend = (rest) => {
    if (rest.status === 'SUSPENDED') {
      activateRestaurant(rest.id);
      showToast?.(`${rest.name} has been activated.`, 'success');
    } else {
      suspendRestaurant(rest.id);
      showToast?.(`${rest.name} has been suspended.`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage vendor listings, commission overrides, and operational availability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/approvals"
            className="px-3.5 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            Review Pending ({restaurants.filter((r) => r.status === 'PENDING').length})
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by restaurant name, cuisine, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Statuses ({restaurants.length})</option>
            <option value="ACTIVE">Active ({restaurants.filter((r) => r.status === 'ACTIVE').length})</option>
            <option value="PENDING">Pending Approval ({restaurants.filter((r) => r.status === 'PENDING').length})</option>
            <option value="SUSPENDED">Suspended ({restaurants.filter((r) => r.status === 'SUSPENDED').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Cuisines</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Dishes</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Kitchen Status</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No restaurants found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((rest) => {
                  const dishCount = foods.filter((f) => f.restaurantId === rest.id).length;

                  return (
                    <tr key={rest.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.image}
                            alt={rest.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{rest.name}</p>
                            <p className="text-[11px] text-gray-400">{rest.location || 'Mumbai'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {rest.cuisines?.slice(0, 2).join(', ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rest.rating || 'New'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {dishCount} items
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-brand-orange">
                        {rest.commissionRate || 15}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            rest.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rest.isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={rest.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRest(rest)}
                            className="p-1.5 text-gray-600 hover:text-brand-orange hover:bg-orange-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditModal({ open: true, restaurant: { ...rest } })}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Restaurant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {rest.status !== 'PENDING' && (
                            <button
                              onClick={() => handleToggleSuspend(rest)}
                              className={`p-1.5 rounded transition-colors ${
                                rest.status === 'SUSPENDED'
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={rest.status === 'SUSPENDED' ? 'Activate Kitchen' : 'Suspend Kitchen'}
                            >
                              {rest.status === 'SUSPENDED' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedRest && (
        <Modal
          isOpen={!!selectedRest}
          onClose={() => setSelectedRest(null)}
          title={`Restaurant Profile: ${selectedRest.name}`}
        >
          <div className="space-y-4 text-xs">
            <img
              src={selectedRest.banner || selectedRest.image}
              alt={selectedRest.name}
              className="w-full h-36 object-cover rounded-xl"
            />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedRest.name}</h3>
                <p className="text-gray-500">{selectedRest.tagline}</p>
              </div>
              <StatusBadge status={selectedRest.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Owner</span>
                <span className="font-bold text-gray-800">{selectedRest.ownerName || 'Partner'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Contact Phone</span>
                <span className="font-bold text-gray-800">{selectedRest.phone || 'N/A'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Commission Rate</span>
                <span className="font-bold text-brand-orange">{selectedRest.commissionRate || 15}%</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Avg Delivery Time</span>
                <span className="font-bold text-gray-800">{selectedRest.deliveryTime}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Min Order</span>
                <span className="font-bold text-gray-800">₹{selectedRest.minOrder}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-400 block font-medium">Opening Hours</span>
                <span className="font-bold text-gray-800">{selectedRest.openingHours}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-400 block font-medium mb-1">Full Kitchen Address</span>
              <p className="text-gray-700">{selectedRest.address}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedRest(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Restaurant Modal */}
      {editModal.open && (
        <Modal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, restaurant: null })}
          title={`Edit Restaurant: ${editModal.restaurant?.name}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={editModal.restaurant?.name || ''}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    restaurant: { ...editModal.restaurant, name: e.target.value },
                  })
                }
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editModal.restaurant?.commissionRate || 15}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      restaurant: { ...editModal.restaurant, commissionRate: e.target.value },
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={editModal.restaurant?.status || 'ACTIVE'}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      restaurant: { ...editModal.restaurant, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Delivery Time (Estimate)</label>
                <input
                  type="text"
                  value={editModal.restaurant?.deliveryTime || ''}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      restaurant: { ...editModal.restaurant, deliveryTime: e.target.value },
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={editModal.restaurant?.minOrder || 150}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      restaurant: { ...editModal.restaurant, minOrder: e.target.value },
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={editModal.restaurant?.phone || ''}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    restaurant: { ...editModal.restaurant, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditModal({ open: false, restaurant: null })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg shadow cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

