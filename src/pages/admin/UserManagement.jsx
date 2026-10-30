import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function UserManagement() {
  const { users, toggleUserStatus } = useAuth();
  const { orders } = useOrders();
  const { showToast } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, user: null, newStatus: null });

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery));

      const matchesRole = roleFilter === 'ALL' || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Selected User's Orders
  const userOrders = useMemo(() => {
    if (!selectedUser) return [];
    return orders.filter(
      (o) => o.customerId === selectedUser.id || o.customerEmail === selectedUser.email
    );
  }, [orders, selectedUser]);

  const handleStatusChangeClick = (user, newStatus) => {
    setConfirmModal({ open: true, user, newStatus });
  };

  const handleConfirmStatusChange = () => {
    if (!confirmModal.user || !confirmModal.newStatus) return;
    toggleUserStatus(confirmModal.user.id, confirmModal.newStatus);
    showToast?.(
      `User account ${confirmModal.user.name} is now ${confirmModal.newStatus}`,
      'success'
    );
    setConfirmModal({ open: false, user: null, newStatus: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer accounts, restaurant partner credentials, and platform access states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Roles</option>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant Partner</option>
            <option value="admin">Platform Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="SUSPENDED">Suspended Accounts</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">User Profile</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered On</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-[11px] text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'restaurant'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <p>{user.phone || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Initial'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-brand-orange bg-gray-50 hover:bg-orange-50 rounded border border-gray-200 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        {user.role !== 'admin' && (
                          user.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleStatusChangeClick(user, 'SUSPENDED')}
                              className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChangeClick(user, 'ACTIVE')}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Activate
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`User Profile: ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-[10px] uppercase bg-gray-200 px-2 py-0.5 rounded">
                    {selectedUser.role}
                  </span>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <span className="text-gray-400 block font-medium">User ID</span>
                <span className="font-mono text-gray-700">{selectedUser.id}</span>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <span className="text-gray-400 block font-medium">Phone</span>
                <span className="font-semibold text-gray-700">{selectedUser.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Saved Addresses */}
            {selectedUser.addresses && selectedUser.addresses.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Saved Delivery Addresses</h4>
                <div className="space-y-1.5">
                  {selectedUser.addresses.map((addr) => (
                    <div key={addr.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="font-semibold text-gray-800">{addr.title}</p>
                      <p className="text-gray-500">{addr.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Orders for customer */}
            {selectedUser.role === 'customer' && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Order History ({userOrders.length})</h4>
                {userOrders.length === 0 ? (
                  <p className="text-gray-400 italic">No orders placed by this customer yet.</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-2 bg-gray-50 rounded-lg flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-brand-orange">{ord.id}</span>
                          <span className="text-gray-500 ml-2">• {ord.restaurantName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₹{ord.grandTotal}</span>
                          <StatusBadge status={ord.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <Modal
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, user: null, newStatus: null })}
          title={`${confirmModal.newStatus === 'SUSPENDED' ? 'Suspend' : 'Activate'} User Account`}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to change the account status of{' '}
              <span className="font-bold text-gray-900">{confirmModal.user?.name}</span> to{' '}
              <span className="font-bold uppercase text-brand-orange">{confirmModal.newStatus}</span>?
            </p>
            {confirmModal.newStatus === 'SUSPENDED' && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                Suspended users will be immediately logged out and prohibited from placing orders or logging into the platform until reactivated.
              </p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ open: false, user: null, newStatus: null })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-sm ${
                  confirmModal.newStatus === 'SUSPENDED'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {confirmModal.newStatus}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

