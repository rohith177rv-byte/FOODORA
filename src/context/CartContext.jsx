import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'foodora_cart';

function loadCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);
  const [toast, setToast] = useState(null);

  // Persist cart to LocalStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback(
    (food) => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === food.id);
        if (existing) {
          showToast(`Updated ${food.name} quantity`);
          return prev.map((item) =>
            item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        showToast(`${food.name} added to cart`);
        return [...prev, { ...food, quantity: 1 }];
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (foodId) => {
      setCartItems((prev) => {
        const item = prev.find((i) => i.id === foodId);
        if (item) showToast(`${item.name} removed from cart`, 'info');
        return prev.filter((item) => item.id !== foodId);
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== foodId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (foodId) => {
      const item = cartItems.find((i) => i.id === foodId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        toast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

