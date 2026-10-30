import { useState, useMemo } from 'react';
import {
  MessageSquare,
  AlertCircle,
  Star,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  User,
  Store,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function FeedbackManagement() {
  const { complaints, reviews, updateComplaintStatus } = usePlatform();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'reviews'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resolveModal, setResolveModal] = useState({ open: false, complaint: null });
  const [resolutionStatus, setResolutionStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');

  // Filtered Complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.userName && c.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.userEmail && c.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      return (
        r.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [reviews, searchQuery]);

  const handleOpenResolve = (comp) => {
    setResolveModal({ open: true, complaint: comp });
    setResolutionStatus(comp.status === 'RESOLVED' ? 'RESOLVED' : 'RESOLVED');
    setAdminNotes(comp.adminNotes || 'Issue reviewed by FOODORA Operations Team and resolution applied.');
  };

  const handleSaveResolution = () => {
    if (!resolveModal.complaint) return;
    updateComplaintStatus(resolveModal.complaint.id, resolutionStatus, adminNotes);
    showToast?.(`Ticket #${resolveModal.complaint.id} status updated to ${resolutionStatus}`, 'success');
    setResolveModal({ open: false, complaint: null });
    setAdminNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints & Platform Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resolve customer disputes, partner inquiries, and monitor restaurant dining reviews.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'complaints'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Support Tickets & Disputes</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
            {complaints.filter((c) => c.status === 'PENDING').length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Customer Restaurant Reviews</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {reviews.length}
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'complaints' ? 'Search ticket subject, user, text...' : 'Search reviews or restaurants...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </div>

        {activeTab === 'complaints' && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Action</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        )}
      </div>

      {/* Complaints List */}
      {activeTab === 'complaints' ? (
        filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No support tickets found</h3>
            <p className="text-xs text-gray-400 mt-1">All disputes and inquiries are resolved.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        comp.userType === 'RESTAURANT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {comp.userType || 'CUSTOMER'}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">{comp.subject}</span>
                    <span className="text-xs text-gray-400 font-mono">({comp.id})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={comp.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>
                    Sender: <strong className="text-gray-800">{comp.userName}</strong> ({comp.userEmail})
                  </span>
                  <span>Category: <strong className="text-gray-800">{comp.category}</strong></span>
                  {comp.orderId && (
                    <span>Related Order: <strong className="text-brand-orange font-mono">{comp.orderId}</strong></span>
                  )}
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                  {comp.description}
                </p>

                {comp.adminNotes && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs">
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      Admin Resolution Applied:
                    </p>
                    <p className="text-emerald-700">{comp.adminNotes}</p>
                    {comp.resolvedAt && (
                      <p className="text-[10px] text-emerald-600 mt-1">
                        Resolved on {new Date(comp.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleOpenResolve(comp)}
                    className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    {comp.status === 'RESOLVED' ? 'Update Resolution' : 'Review & Resolve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Reviews List */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Feedback Comment</th>
                  <th className="px-4 py-3">Kitchen Reply</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      No customer reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-bold text-gray-900">{rev.restaurantName}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{rev.customerName}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {rev.rating}/5
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs">{rev.comment}</td>
                      <td className="px-4 py-3">
                        {rev.restaurantResponse ? (
                          <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            Replied
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No reply yet</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {resolveModal.open && (
        <Modal
          isOpen={resolveModal.open}
          onClose={() => setResolveModal({ open: false, complaint: null })}
          title={`Resolve Ticket #${resolveModal.complaint?.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-bold text-gray-900">{resolveModal.complaint?.subject}</p>
              <p className="text-gray-500 mt-1">{resolveModal.complaint?.description}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Ticket Resolution Status</label>
              <select
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-orange"
              >
                <option value="RESOLVED">RESOLVED (Close Ticket)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Investigating)</option>
                <option value="PENDING">PENDING (Awaiting Details)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Admin Response & Resolution Notes *</label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Write official resolution notes visible to user/restaurant..."
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolveModal({ open: false, complaint: null })}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResolution}
                className="px-4 py-2 font-bold bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg cursor-pointer shadow-sm"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

