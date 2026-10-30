import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Store,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const initialRestId = searchParams.get('restId') || '';

  const { restaurants, reviews, complaints, addReview, addComplaint } = usePlatform();
  const { currentUser, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState(initialOrderId ? 'review' : 'review'); // 'review' | 'complaint' | 'history'

  // Review Form State
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [selectedRestId, setSelectedRestId] = useState(initialRestId || (restaurants[0]?.id || ''));
  const [rating, setRating] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [deliveryExp, setDeliveryExp] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCategory, setReviewCategory] = useState('Food Quality');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Delivery');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintOrderId, setComplaintOrderId] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Delivered orders of current customer for reviewing
  const deliveredOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      (o) =>
        (o.customerId === currentUser.id || o.customerEmail === currentUser.email) &&
        o.status === 'DELIVERED'
    );
  }, [orders, currentUser]);

  // Customer's submitted reviews and complaints
  const myReviews = useMemo(
    () =>
      reviews.filter(
        (r) => r.customerId === currentUser?.id || r.customerName === currentUser?.name
      ),
    [reviews, currentUser]
  );

  const myComplaints = useMemo(
    () =>
      complaints.filter(
        (c) => c.customerId === currentUser?.id || c.customerName === currentUser?.name
      ),
    [complaints, currentUser]
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const rest = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

    addReview({
      orderId: selectedOrderId || 'FOOD-DIRECT',
      customerId: currentUser?.id || `guest_${Date.now()}`,
      customerName: currentUser?.name || 'Happy Customer',
      restaurantId: rest.id,
      restaurantName: rest.name,
      rating: Number(rating),
      foodQuality: Number(foodQuality),
      deliveryExperience: Number(deliveryExp),
      comment: reviewComment.trim(),
      category: reviewCategory,
    });

    setReviewSubmitted(true);
    showToast('Review submitted! Thank you for helping our kitchen improve.', 'success');
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) return;

    addComplaint({
      orderId: complaintOrderId.trim() || null,
      customerId: currentUser?.id || `guest_${Date.now()}`,
      customerName: currentUser?.name || 'Customer',
      userRole: 'customer',
      category: complaintCategory,
      subject: complaintSubject.trim(),
      description: complaintDesc.trim(),
    });

    setComplaintSubmitted(true);
    showToast('Support ticket registered! Admin team will review promptly.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Feedback & Support Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Share your dining feedback with kitchens or escalate issues to FOODORA administration
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('review');
              setReviewSubmitted(false);
            }}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'review'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Star size={14} />
            Review a Meal / Kitchen
          </button>
          <button
            onClick={() => {
              setActiveTab('complaint');
              setComplaintSubmitted(false);
            }}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'complaint'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldAlert size={14} />
            Platform Complaint / Help
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={14} />
            My Feedback History ({myReviews.length + myComplaints.length})
          </button>
        </div>

        {/* Tab 1: Review a Restaurant Meal */}
        {activeTab === 'review' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            {reviewSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-extrabold text-lg text-gray-900">Thank You for Your Review!</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your feedback helps restaurant chefs refine recipes and guides fellow foodies on FOODORA.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setReviewSubmitted(false);
                      setReviewComment('');
                    }}
                    className="px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6 text-xs">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1">
                    Rate Your Kitchen & Dishes
                  </h3>
                  <p className="text-gray-400">
                    How was the meal prepared and delivered to your doorstep?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Select Restaurant */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Select Restaurant <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedRestId}
                      onChange={(e) => setSelectedRestId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#FF6B35]"
                    >
                      {restaurants
                        .filter((r) => r.status === 'ACTIVE')
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.location})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Optional Order ID Link */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Linked Order (Optional)
                    </label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#FF6B35]"
                    >
                      <option value="">General Kitchen Experience</option>
                      {deliveredOrders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id} • {o.restaurantName} (₹{o.bill.grandTotal})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Star Ratings */}
                <div className="grid sm:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block font-bold text-gray-700 text-xs mb-2">
                      Overall Experience
                    </label>
                    <div className="flex gap-1.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={star <= rating ? 'fill-current' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 text-xs mb-2">
                      Taste & Quality
                    </label>
                    <div className="flex gap-1.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFoodQuality(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={star <= foodQuality ? 'fill-current' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 text-xs mb-2">
                      Delivery Experience
                    </label>
                    <div className="flex gap-1.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setDeliveryExp(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={star <= deliveryExp ? 'fill-current' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Written Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us what you loved about the food, portion size, seasoning, or packaging..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-orange-200 cursor-pointer"
                >
                  Submit Dining Review
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Platform Complaint / Inquiry */}
        {activeTab === 'complaint' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            {complaintSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-extrabold text-lg text-gray-900">Complaint Ticket Registered</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Our platform administrator team has received your ticket and will investigate the issue.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setComplaintSubmitted(false);
                      setComplaintSubject('');
                      setComplaintDesc('');
                    }}
                    className="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-5 text-xs">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1">
                    FOODORA Platform Help & Grievances
                  </h3>
                  <p className="text-gray-400">
                    Report delivery partner delays, payment discrepancies, or packaging issues
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#FF6B35]"
                    >
                      <option value="Food Quality">Food Hygiene & Quality</option>
                      <option value="Delivery">Delivery Rider Delay / Conduct</option>
                      <option value="Payment">Payment / Refund Discrepancy</option>
                      <option value="General Platform">FOODORA App or Account Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                      Order ID (if applicable)
                    </label>
                    <input
                      type="text"
                      value={complaintOrderId}
                      onChange={(e) => setComplaintOrderId(e.target.value)}
                      placeholder="e.g. FOOD-A892K1"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Subject / Summary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
                    Detailed Explanation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Please describe what happened in detail..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Register Complaint
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Reviews */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                Submitted Reviews ({myReviews.length})
              </h3>
              {myReviews.length === 0 ? (
                <p className="text-xs text-gray-400">No meal reviews submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{r.restaurantName}</span>
                        <span className="text-yellow-600 font-bold flex items-center gap-1">
                          <Star size={13} className="fill-current" />
                          {r.rating} ★
                        </span>
                      </div>
                      <p className="text-gray-600 italic">"{r.comment}"</p>
                      {r.restaurantResponse && (
                        <div className="p-2.5 bg-orange-50 rounded-xl text-[11px] text-[#FF6B35] mt-2">
                          <span className="font-bold">Restaurant Response:</span>{' '}
                          {r.restaurantResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Complaints */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                Support Tickets & Grievances ({myComplaints.length})
              </h3>
              {myComplaints.length === 0 ? (
                <p className="text-xs text-gray-400">No support tickets registered.</p>
              ) : (
                <div className="space-y-3">
                  {myComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{c.subject}</span>
                        <StatusBadge status={c.status} size="xs" />
                      </div>
                      <p className="text-gray-600">{c.description}</p>
                      {c.adminNotes && (
                        <div className="p-2.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-[11px] mt-2">
                          <span className="font-bold">Admin Resolution:</span> {c.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

