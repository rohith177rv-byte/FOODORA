// Utility: Bill calculator for cart
// Calculates subtotal, delivery fee, tax, and grand total.

const DELIVERY_FEE = 30;
const TAX_RATE = 0.05; // 5% tax
const FREE_DELIVERY_THRESHOLD = 299;

/**
 * Calculate the complete bill breakdown from cart items.
 * @param {Array} cartItems - Array of { ...foodItem, quantity }
 * @returns {{ subtotal: number, deliveryFee: number, tax: number, grandTotal: number }}
 */
export function calculateBill(cartItems) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const grandTotal = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  return { subtotal, deliveryFee, tax, grandTotal };
}

export { DELIVERY_FEE, TAX_RATE, FREE_DELIVERY_THRESHOLD };

