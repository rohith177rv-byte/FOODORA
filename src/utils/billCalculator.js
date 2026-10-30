// Enhanced Bill Calculator for FOODORA
// Supports dynamic platform settings, coupon codes, and item discounts.

export const DEFAULT_DELIVERY_FEE = 30;
export const DEFAULT_TAX_RATE = 0.05;
export const DEFAULT_FREE_DELIVERY_THRESHOLD = 299;

/**
 * Calculate complete bill breakdown from cart items.
 * @param {Array} cartItems - Array of { ...foodItem, quantity }
 * @param {Object} options - { settings, coupon }
 * @returns {{ subtotal: number, deliveryFee: number, tax: number, discount: number, grandTotal: number, couponCode: string|null }}
 */
export function calculateBill(cartItems = [], options = {}) {
  const { settings = {}, coupon = null } = options;

  const standardDeliveryFee =
    typeof settings.deliveryFee === 'number' ? settings.deliveryFee : DEFAULT_DELIVERY_FEE;
  const freeDeliveryThreshold =
    typeof settings.freeDeliveryThreshold === 'number'
      ? settings.freeDeliveryThreshold
      : DEFAULT_FREE_DELIVERY_THRESHOLD;
  const taxRate =
    typeof settings.taxRate === 'number' ? settings.taxRate : DEFAULT_TAX_RATE;

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  let deliveryFee = 0;
  if (subtotal > 0) {
    deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : standardDeliveryFee;
  }

  // Calculate coupon discount
  let discount = 0;
  let couponCode = null;

  if (coupon && subtotal >= (coupon.minOrderValue || 0)) {
    couponCode = coupon.code;
    if (coupon.discountType === 'PERCENTAGE') {
      const calculated = (subtotal * coupon.discountValue) / 100;
      discount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    } else if (coupon.discountType === 'FIXED') {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = parseFloat((taxableAmount * taxRate).toFixed(2));
  const grandTotal = parseFloat(
    Math.max(0, taxableAmount + deliveryFee + tax).toFixed(2)
  );

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    tax,
    discount: parseFloat(discount.toFixed(2)),
    grandTotal,
    couponCode,
    isFreeDelivery: deliveryFee === 0 && subtotal > 0,
    amountForFreeDelivery:
      subtotal > 0 && subtotal < freeDeliveryThreshold
        ? parseFloat((freeDeliveryThreshold - subtotal).toFixed(2))
        : 0,
  };
}
