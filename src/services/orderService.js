// Order service – handles order creation and history.
// Currently uses LocalStorage; can be swapped with API calls later.
// Future: POST /api/orders, GET /api/orders/{id}

import { generateOrderId } from '../utils/generateOrderId.js';

const ORDERS_STORAGE_KEY = 'foodora_orders';

/**
 * Place a new order.
 * @param {{ customerName: string, mobile: string, address: string, instructions?: string, items: Array, bill: Object }} orderData
 * @returns {Promise<Object>} The created order object
 */
export async function placeOrder(orderData) {
  return new Promise((resolve) => {
    const order = {
      id: generateOrderId(),
      ...orderData,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedPrepTime: calculatePrepTime(orderData.items),
    };

    // Save to LocalStorage
    const existing = getOrdersFromStorage();
    existing.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));

    setTimeout(() => resolve(order), 500);
  });
}

/**
 * Get all previous orders.
 * @returns {Promise<Array>}
 */
export async function getOrders() {
  return new Promise((resolve) => {
    const orders = getOrdersFromStorage();
    setTimeout(() => resolve(orders), 200);
  });
}

/**
 * Get a specific order by ID.
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export async function getOrderById(orderId) {
  return new Promise((resolve) => {
    const orders = getOrdersFromStorage();
    const order = orders.find((o) => o.id === orderId) || null;
    setTimeout(() => resolve(order), 100);
  });
}

/**
 * Read orders from LocalStorage.
 */
function getOrdersFromStorage() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Estimate preparation time based on items.
 */
function calculatePrepTime(items) {
  const maxPrepTime = items.reduce((max, item) => {
    const time = parseInt(item.prepTime) || 15;
    return Math.max(max, time);
  }, 0);
  return `${maxPrepTime + 10} min`; // Add 10 min buffer
}

