import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'foodora_cart';
const COUPON_STORAGE_KEY = 'foodora_applied_coupon';
const FAV_FOODS_KEY = 'foodora_fav_foods';
const FAV_RESTAURANTS_KEY = 'foodora_fav_restaurants';

function loadStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadStorage(CART_STORAGE_KEY, []));
  const [appliedCoupon, setAppliedCoupon] = useState(() => loadStorage(COUPON_STORAGE_KEY, null));
  const [favoriteFoods, setFavoriteFoods] = useState(() => loadStorage(FAV_FOODS_KEY, [1, 4, 7]));
  const [favoriteRestaurants, setFavoriteRestaurants] = useState(() =>
    loadStorage(FAV_RESTAURANTS_KEY, ['rest_1', 'rest_4'])
  );
  const [toast, setToast] = useState(null);
  const [restaurantConflict, setRestaurantConflict] = useState(null);

  // Persist cart & preferences to LocalStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(FAV_FOODS_KEY, JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  useEffect(() => {
    localStorage.setItem(FAV_RESTAURANTS_KEY, JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Current active restaurant ID in cart
  const cartRestaurantId = useMemo(() => {
    if (cartItems.length === 0) return null;
    return cartItems[0].restaurantId || 'rest_1';
  }, [cartItems]);

  const addToCart = useCallback(
    (food, instructions = '') => {
      // Check multi-restaurant conflict
      const targetRestaurantId = food.restaurantId || 'rest_1';
      if (cartItems.length > 0 && cartRestaurantId && cartRestaurantId !== targetRestaurantId) {
        setRestaurantConflict({
          pendingFood: food,
          currentRestaurantId: cartRestaurantId,
          newRestaurantId: targetRestaurantId,
        });
        return false;
      }

      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === food.id);
        if (existing) {
          showToast(`Updated ${food.name} quantity`);
          return prev.map((item) =>
            item.id === food.id
              ? { ...item, quantity: item.quantity + 1, instructions: instructions || item.instructions }
              : item
          );
        }
        showToast(`${food.name} added to cart`);
        return [
          ...prev,
          {
            ...food,
            quantity: 1,
            restaurantId: targetRestaurantId,
            instructions: instructions || '',
          },
        ];
      });
      return true;
    },
    [cartItems.length, cartRestaurantId, showToast]
  );

  const clearCartAndAdd = useCallback(
    (food) => {
      const targetRestaurantId = food.restaurantId || 'rest_1';
      setCartItems([
        {
          ...food,
          quantity: 1,
          restaurantId: targetRestaurantId,
        },
      ]);
      setRestaurantConflict(null);
      setAppliedCoupon(null);
      showToast(`Cart reset: Added ${food.name}`);
    },
    [showToast]
  );

  const dismissConflict = useCallback(() => {
    setRestaurantConflict(null);
  }, []);

  const removeFromCart = useCallback(
    (foodId) => {
      setCartItems((prev) => {
        const item = prev.find((i) => i.id === foodId);
        if (item) showToast(`${item.name} removed from cart`, 'info');
        const next = prev.filter((i) => i.id !== foodId);
        if (next.length === 0) {
          setAppliedCoupon(null);
        }
        return next;
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => {
        const next = prev.filter((item) => item.id !== foodId);
        if (next.length === 0) {
          setAppliedCoupon(null);
        }
        return next;
      });
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, quantity } : item))
    );
  }, []);

  const updateItemInstructions = useCallback((foodId, instructions) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, instructions } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
    setRestaurantConflict(null);
  }, []);

  const getItemQuantity = useCallback(
    (foodId) => {
      const item = cartItems.find((i) => i.id === foodId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const applyCoupon = useCallback(
    (coupon) => {
      setAppliedCoupon(coupon);
      showToast(`Coupon ${coupon.code} applied!`, 'success');
    },
    [showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  }, [showToast]);

  // FAVORITES
  const toggleFavoriteFood = useCallback(
    (foodId) => {
      setFavoriteFoods((prev) => {
        const exists = prev.includes(foodId);
        if (exists) {
          showToast('Removed from favorites', 'info');
          return prev.filter((id) => id !== foodId);
        } else {
          showToast('Added to favorite dishes ❤️', 'success');
          return [...prev, foodId];
        }
      });
    },
    [showToast]
  );

  const toggleFavoriteRestaurant = useCallback(
    (restId) => {
      setFavoriteRestaurants((prev) => {
        const exists = prev.includes(restId);
        if (exists) {
          showToast('Removed restaurant from favorites', 'info');
          return prev.filter((id) => id !== restId);
        } else {
          showToast('Saved to favorite restaurants ❤️', 'success');
          return [...prev, restId];
        }
      });
    },
    [showToast]
  );

  const isFavoriteFood = useCallback(
    (foodId) => favoriteFoods.includes(foodId),
    [favoriteFoods]
  );

  const isFavoriteRestaurant = useCallback(
    (restId) => favoriteRestaurants.includes(restId),
    [favoriteRestaurants]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartRestaurantId,
        appliedCoupon,
        restaurantConflict,
        toast,
        favoriteFoods,
        favoriteRestaurants,
        addToCart,
        clearCartAndAdd,
        dismissConflict,
        removeFromCart,
        updateQuantity,
        updateItemInstructions,
        clearCart,
        getItemQuantity,
        applyCoupon,
        removeCoupon,
        toggleFavoriteFood,
        toggleFavoriteRestaurant,
        isFavoriteFood,
        isFavoriteRestaurant,
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
