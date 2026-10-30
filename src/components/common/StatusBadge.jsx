export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  const styles = {
    // Order statuses
    PLACED: 'bg-blue-100 text-blue-700 border-blue-200',
    ACCEPTED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    PREPARING: 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse',
    READY: 'bg-purple-100 text-purple-700 border-purple-200',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700 border-orange-200',
    DELIVERED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200',
    REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',

    // Restaurant / User statuses
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    SUSPENDED: 'bg-red-100 text-red-700 border-red-200',
    RESOLVED: 'bg-teal-100 text-teal-700 border-teal-200',
    UNDER_REVIEW: 'bg-sky-100 text-sky-700 border-sky-200',

    // Payment statuses
    SUCCESSFUL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    REFUNDED: 'bg-purple-100 text-purple-700 border-purple-200',
    CASH_ON_DELIVERY: 'bg-slate-100 text-slate-700 border-slate-200',
    FAILED: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const labels = {
    PLACED: 'Order Placed',
    ACCEPTED: 'Accepted',
    PREPARING: 'Cooking / Preparing',
    READY: 'Ready for Pickup',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected',
    ACTIVE: 'Active',
    PENDING: 'Pending Approval',
    SUSPENDED: 'Suspended',
    RESOLVED: 'Resolved',
    UNDER_REVIEW: 'Under Review',
    SUCCESSFUL: 'Paid Online',
    REFUNDED: 'Refund Credited',
    CASH_ON_DELIVERY: 'Cash on Delivery',
    FAILED: 'Failed',
  };

  const badgeClass =
    styles[normalized] || 'bg-gray-100 text-gray-700 border-gray-200';
  const label = labels[normalized] || status;

  const sizeClasses =
    size === 'xs'
      ? 'text-[11px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border shadow-2xs ${badgeClass} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

