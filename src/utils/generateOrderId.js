// Utility: Generate a unique order ID
// Format: FOOD-XXXXXX (6 random alphanumeric characters)

/**
 * Generate a unique order ID for demo purposes.
 * @returns {string} A unique order ID like "FOOD-A3B7K2"
 */
export function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FOOD-${id}`;
}

