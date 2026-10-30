import { useState, useMemo } from 'react';
import { Star, MessageSquare, Reply, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlatform } from '../../context/PlatformContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function RestaurantReviews() {
  const { currentUser } = useAuth();
  const { reviews, respondToReview, restaurants } = usePlatform();
  const { showToast } = useCart();

  const myRestId = currentUser?.restaurantId || 'rest_1';
  const restaurant = restaurants.find((r) => r.id === myRestId) || restaurants[0];

  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const restaurantReviews = useMemo(
    () => reviews.filter((r) => r.restaurantId === myRestId),
    [reviews, myRestId]
  );

  const avgRating = restaurant?.rating || 4.8;

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return;
    respondToReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
    showToast('Reply published to customer review!', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
            Public Sentiment
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            Customer Reviews & Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build customer trust by acknowledging reviews and responding to diner comments
          </p>
        </div>

        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 px-4 py-2.5 rounded-2xl">
          <Star size={22} className="fill-yellow-500 text-yellow-500" />
          <div>
            <span className="text-xl font-black text-yellow-800">{avgRating}</span>
            <span className="text-xs text-slate-500"> / 5.0</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              {restaurantReviews.length} Verified Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck size={16} className="text-[#FF6B35] shrink-0" />
        <span>
          <strong className="text-slate-800">FOODORA Integrity Standard:</strong> In accordance with fair platform guidelines, authentic customer reviews cannot be deleted by restaurants. You may publicly respond to feedback below.
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {restaurantReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-400">
            No customer reviews posted for this kitchen yet.
          </div>
        ) : (
          restaurantReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{rev.customerName}</p>
                  <p className="text-[11px] text-slate-400">
                    Order Ref: <span className="font-mono">{rev.orderId || 'DIRECT'}</span> •{' '}
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-xl font-bold">
                  <Star size={14} className="fill-current text-yellow-500" />
                  {rev.rating} ★
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-xs">"{rev.comment}"</p>

              {/* Published Response */}
              {rev.restaurantResponse ? (
                <div className="bg-orange-50/70 border border-orange-200/80 p-4 rounded-2xl space-y-1">
                  <p className="font-bold text-[#FF6B35] flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    Official Kitchen Response:
                  </p>
                  <p className="text-slate-700 italic">{rev.restaurantResponse}</p>
                  <p className="text-[10px] text-slate-400">
                    Responded on{' '}
                    {new Date(rev.respondedAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              ) : (
                <div>
                  {activeReplyId === rev.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type a polite kitchen response (e.g. Thank you for your feedback! We are thrilled you enjoyed the biryani...)"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B35] resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          className="px-4 py-1.5 bg-[#FF6B35] text-white rounded-xl font-bold"
                        >
                          Publish Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText('');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <Reply size={13} />
                      Reply to Review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

