import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export default function RestaurantFeedback() {
  const { complaints, addComplaint, restaurants } = usePlatform();
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const currentRestaurant = useMemo(() => {
    if (!currentUser) return null;
    return (
      restaurants.find(
        (r) =>
          r.id === currentUser.restaurantId ||
          r.ownerEmail === currentUser.email ||
          r.name.toLowerCase().includes(currentUser.name.toLowerCase())
      ) || restaurants[0]
    );
  }, [restaurants, currentUser]);

  const [ticketCategory, setTicketCategory] = useState('Payouts & Commission');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter complaints/tickets submitted by this restaurant
  const myTickets = useMemo(() => {
    if (!currentRestaurant) return [];
    return complaints.filter(
      (c) =>
        c.userType === 'RESTAURANT' &&
        (c.restaurantId === currentRestaurant.id || c.userName === currentRestaurant.name)
    );
  }, [complaints, currentRestaurant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast?.('Please fill out all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      addComplaint({
        userType: 'RESTAURANT',
        userId: currentUser?.id,
        restaurantId: currentRestaurant?.id,
        userName: currentRestaurant?.name || currentUser?.name || 'Restaurant Partner',
        userEmail: currentUser?.email || 'restaurant@foodora.com',
        category: ticketCategory,
        subject: ticketSubject.trim(),
        description: ticketMessage.trim(),
        priority: ticketPriority,
        status: 'PENDING',
      });

      showToast?.('Support ticket submitted successfully to FOODORA Admin!', 'success');
      setTicketSubject('');
      setTicketMessage('');
      setTicketPriority('Normal');
    } catch {
      showToast?.('Failed to submit ticket. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partner Support & Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">
          Reach out to the FOODORA Platform Administrator for commission inquiries, payout assistance, menu queries, or platform feature requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Open a Support Request</h2>
              <p className="text-xs text-gray-500">
                Logged in as <span className="font-semibold text-gray-700">{currentRestaurant?.name}</span> ({currentUser?.email})
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Inquiry Category *
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  <option value="Payouts & Commission">Payouts & Commission</option>
                  <option value="Menu & Category Assistance">Menu & Category Assistance</option>
                  <option value="Delivery Fleet & Drivers">Delivery Fleet & Drivers</option>
                  <option value="Technical & App Issue">Technical & App Issue</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="General Partner Feedback">General Partner Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Priority Level
                </label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Normal">Normal - Standard Inquiry</option>
                  <option value="High">High - Urgent Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Subject Line *
              </label>
              <input
                type="text"
                placeholder="e.g., Discrepancy in weekly payout statement #942"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Detailed Message / Explanation *
              </label>
              <textarea
                rows={5}
                placeholder="Please describe your query or issue with relevant details (order numbers, dates, dishes involved)..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit to Platform Admin'}
              </button>
            </div>
          </form>
        </div>

        {/* Support Information & Help Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-md">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Partner SLA Support
            </h3>
            <p className="text-sm text-orange-100 mb-4 leading-relaxed">
              FOODORA Administrator reviews incoming partner inquiries within 2-4 business hours. Critical delivery and order issues are prioritized immediately.
            </p>
            <div className="p-3 bg-white/10 rounded-lg text-xs space-y-1">
              <p className="font-medium text-white">Emergency Partner Hotline:</p>
              <p className="font-bold text-white tracking-wide">+91 1800-FOODORA-BIZ</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-orange" />
              Frequently Asked Partner Questions
            </h3>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="p-2.5 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">When are payouts settled?</p>
                <p className="mt-1 text-gray-500">Every Tuesday directly to your registered bank account net of platform commission.</p>
              </li>
              <li className="p-2.5 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">How to temporarily pause orders?</p>
                <p className="mt-1 text-gray-500">Use the Live Kitchen Status toggle on the left sidebar to toggle your kitchen OPEN or CLOSED anytime.</p>
              </li>
              <li className="p-2.5 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">Updating menu dish photos?</p>
                <p className="mt-1 text-gray-500">Visit Menu Management and click Edit on any dish to change description, price, tags, or image URL.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ticket History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Previous Support Inquiries ({myTickets.length})
          </h2>
        </div>

        {myTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium">No previous support tickets found.</p>
            <p className="text-xs text-gray-400 mt-1">
              Your submitted questions and Admin responses will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all bg-gray-50/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded">
                      {ticket.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ticket.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-100">
                  {ticket.description}
                </p>

                {ticket.adminNotes ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Admin Response:
                    </div>
                    <p className="text-emerald-700">{ticket.adminNotes}</p>
                    {ticket.resolvedAt && (
                      <p className="text-[10px] text-emerald-600 mt-1">
                        Resolved on {new Date(ticket.resolvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Under review by FOODORA Operations Team</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

