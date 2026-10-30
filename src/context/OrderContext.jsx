import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialOrders } from '../data/orders.js';
import { generateOrderId } from '../utils/generateOrderId.js';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = 'foodora_orders';

function loadOrders() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : initialOrders;
  } catch {
    return initialOrders;
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Place a new order
  const placeOrder = useCallback(async (orderData) => {
    const orderId = generateOrderId();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'PLACED',
      createdAt: now.toISOString(),
      estimatedPrepTime: orderData.estimatedPrepTime || '25-35 min',
      paymentStatus:
        orderData.paymentMethod === 'Cash on Delivery'
          ? 'CASH_ON_DELIVERY'
          : orderData.paymentStatus || 'SUCCESSFUL',
      transactionId:
        orderData.transactionId ||
        `TXN-${(orderData.paymentMethod || 'PAY').substring(0, 3).toUpperCase()}-${Math.floor(
          1000000 + Math.random() * 9000000
        )}`,
      timeline: [
        { status: 'Order Placed', time: timeString, completed: true },
        { status: 'Restaurant Accepted', time: 'Pending', completed: false },
        { status: 'Food Preparation', time: 'Pending', completed: false },
        { status: 'Ready for Pickup', time: 'Pending', completed: false },
        { status: 'Out for Delivery', time: 'Pending', completed: false },
        { status: 'Delivered', time: 'Pending', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Restaurant or Admin updates order status
  const updateOrderStatus = useCallback((orderId, newStatus, extra = {}) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let updatedTimeline = order.timeline ? [...order.timeline] : [];

        const statusMap = {
          ACCEPTED: 'Restaurant Accepted',
          PREPARING: 'Food Preparation',
          READY: 'Ready for Pickup',
          OUT_FOR_DELIVERY: 'Out for Delivery',
          DELIVERED: 'Delivered',
        };

        const targetStep = statusMap[newStatus];
        if (targetStep) {
          updatedTimeline = updatedTimeline.map((step) => {
            if (step.status === targetStep) {
              return { ...step, time: timeString, completed: true };
            }
            return step;
          });
        }

        // Handle restaurant rejection
        if (newStatus === 'REJECTED') {
          return {
            ...order,
            status: 'CANCELLED',
            cancelledBy: 'RESTAURANT',
            cancellationReason: extra.reason || 'Restaurant could not fulfill order at this time',
            paymentStatus:
              order.paymentMethod === 'Cash on Delivery' ? 'CASH_ON_DELIVERY' : 'REFUNDED',
            timeline: [
              ...updatedTimeline,
              { status: 'Rejected by Restaurant', time: timeString, completed: true },
            ],
          };
        }

        return {
          ...order,
          status: newStatus,
          timeline: updatedTimeline,
          ...extra,
        };
      })
    );
  }, []);

  // Customer or Admin cancels an order
  const cancelOrder = useCallback((orderId, reason, comments, cancelledBy = 'CUSTOMER') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        return {
          ...order,
          status: 'CANCELLED',
          cancelledBy,
          cancellationReason: reason || 'Customer request',
          cancellationComments: comments || '',
          cancelledAt: now.toISOString(),
          paymentStatus:
            order.paymentMethod === 'Cash on Delivery' ? 'CASH_ON_DELIVERY' : 'REFUNDED',
          timeline: [
            ...(order.timeline || []),
            { status: 'Order Cancelled', time: timeString, completed: true },
          ],
        };
      })
    );
  }, []);

  // Check if order is eligible for cancellation by customer
  // Rule: Allowed before food preparation begins (PLACED or ACCEPTED)
  const isCancellableByCustomer = useCallback((order) => {
    if (!order) return false;
    return order.status === 'PLACED' || order.status === 'ACCEPTED';
  }, []);

  // Query helpers
  const getOrdersByCustomer = useCallback(
    (customerId) => {
      return orders.filter((o) => o.customerId === customerId);
    },
    [orders]
  );

  const getOrdersByRestaurant = useCallback(
    (restaurantId) => {
      return orders.filter((o) => o.restaurantId === restaurantId);
    },
    [orders]
  );

  const getOrderById = useCallback(
    (orderId) => {
      return orders.find((o) => o.id === orderId) || null;
    },
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        isCancellableByCustomer,
        getOrdersByCustomer,
        getOrdersByRestaurant,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

