import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialFoods from '../data/foodData.js';
import { initialRestaurants } from '../data/restaurants.js';
import { initialPromotions } from '../data/promotions.js';
import { initialPlatformSettings } from '../data/platformSettings.js';
import { initialReviews, initialComplaints } from '../data/feedback.js';

const PlatformContext = createContext();

const RESTAURANTS_KEY = 'foodora_restaurants';
const FOODS_KEY = 'foodora_foods';
const PROMOTIONS_KEY = 'foodora_promotions';
const SETTINGS_KEY = 'foodora_settings';
const REVIEWS_KEY = 'foodora_reviews';
const COMPLAINTS_KEY = 'foodora_complaints';

function loadStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function PlatformProvider({ children }) {
  const [restaurants, setRestaurants] = useState(() =>
    loadStorage(RESTAURANTS_KEY, initialRestaurants)
  );
  const [foods, setFoods] = useState(() => loadStorage(FOODS_KEY, initialFoods));
  const [promotions, setPromotions] = useState(() =>
    loadStorage(PROMOTIONS_KEY, initialPromotions)
  );
  const [platformSettings, setPlatformSettings] = useState(() =>
    loadStorage(SETTINGS_KEY, initialPlatformSettings)
  );
  const [reviews, setReviews] = useState(() =>
    loadStorage(REVIEWS_KEY, initialReviews)
  );
  const [complaints, setComplaints] = useState(() =>
    loadStorage(COMPLAINTS_KEY, initialComplaints)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(FOODS_KEY, JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  }, [complaints]);

  // RESTAURANT MANAGEMENT ACTIONS
  const applyRestaurantRegistration = useCallback((appData) => {
    const newRestaurant = {
      id: `rest_${Date.now()}`,
      name: appData.name.trim(),
      tagline: appData.tagline?.trim() || 'Delicious meals crafted fresh',
      ownerEmail: appData.email.trim(),
      ownerName: appData.ownerName.trim(),
      phone: appData.phone.trim(),
      cuisines: appData.cuisines || ['Indian'],
      rating: 0,
      reviewCount: 0,
      deliveryTime: appData.deliveryTime || '30-40 min',
      minOrder: Number(appData.minOrder) || 150,
      costForTwo: Number(appData.costForTwo) || 400,
      address: appData.address.trim(),
      location: appData.location?.trim() || 'Mumbai',
      openingHours: appData.openingHours || '11:00 AM - 11:00 PM',
      isOpen: false,
      isFeatured: false,
      status: 'PENDING',
      registeredAt: new Date().toISOString(),
      image:
        appData.image ||
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      banner:
        appData.banner ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
      commissionRate: 15,
    };

    setRestaurants((prev) => [newRestaurant, ...prev]);
    return newRestaurant;
  }, []);

  const approveRestaurant = useCallback((restaurantId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, status: 'ACTIVE', isOpen: true } : r
      )
    );
  }, []);

  const rejectRestaurant = useCallback((restaurantId, reason) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, status: 'REJECTED', rejectionReason: reason, isOpen: false }
          : r
      )
    );
  }, []);

  const suspendRestaurant = useCallback((restaurantId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, status: 'SUSPENDED', isOpen: false } : r
      )
    );
  }, []);

  const activateRestaurant = useCallback((restaurantId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, status: 'ACTIVE', isOpen: true } : r
      )
    );
  }, []);

  const updateRestaurantProfile = useCallback((restaurantId, updates) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, ...updates } : r))
    );
  }, []);

  const toggleRestaurantOpenStatus = useCallback((restaurantId) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r))
    );
  }, []);

  // FOOD MENU MANAGEMENT (CRUD)
  const addFoodItem = useCallback((foodItem) => {
    const newFood = {
      ...foodItem,
      id: Date.now(),
      rating: 4.5,
      isAvailable: foodItem.isAvailable !== false,
      stockQuantity: Number(foodItem.stockQuantity) || 30,
    };
    setFoods((prev) => [newFood, ...prev]);
    return newFood;
  }, []);

  const updateFoodItem = useCallback((foodId, updates) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, ...updates } : f))
    );
  }, []);

  const deleteFoodItem = useCallback((foodId) => {
    setFoods((prev) => prev.filter((f) => f.id !== foodId));
  }, []);

  const toggleFoodAvailability = useCallback((foodId) => {
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId ? { ...f, isAvailable: !f.isAvailable } : f
      )
    );
  }, []);

  const updateFoodStock = useCallback((foodId, newStock) => {
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId ? { ...f, stockQuantity: Math.max(0, newStock) } : f
      )
    );
  }, []);

  // PROMOTIONS MANAGEMENT
  const addPromotion = useCallback((promo) => {
    const newPromo = {
      ...promo,
      id: `promo_${Date.now()}`,
      isActive: true,
      minOrderValue: Number(promo.minOrderValue) || 100,
      discountValue: Number(promo.discountValue) || 10,
    };
    setPromotions((prev) => [newPromo, ...prev]);
    return newPromo;
  }, []);

  const togglePromotion = useCallback((promoId) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p))
    );
  }, []);

  const deletePromotion = useCallback((promoId) => {
    setPromotions((prev) => prev.filter((p) => p.id !== promoId));
  }, []);

  // PLATFORM SETTINGS
  const updatePlatformSettings = useCallback((newSettings) => {
    setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // REVIEWS & COMPLAINTS
  const addReview = useCallback((reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString(),
      restaurantResponse: null,
      respondedAt: null,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Update restaurant rating
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === reviewData.restaurantId) {
          const totalRating = (r.rating * r.reviewCount + reviewData.rating);
          const newCount = r.reviewCount + 1;
          return {
            ...r,
            rating: parseFloat((totalRating / newCount).toFixed(1)),
            reviewCount: newCount,
          };
        }
        return r;
      })
    );
    return newReview;
  }, []);

  const respondToReview = useCallback((reviewId, responseText) => {
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === reviewId
          ? {
              ...rev,
              restaurantResponse: responseText,
              respondedAt: new Date().toISOString(),
            }
          : rev
      )
    );
  }, []);

  const addComplaint = useCallback((complaintData) => {
    const newComplaint = {
      id: `cmp_${Date.now()}`,
      ...complaintData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      adminNotes: null,
      resolvedAt: null,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  }, []);

  const updateComplaintStatus = useCallback((complaintId, status, adminNotes) => {
    setComplaints((prev) =>
      prev.map((cmp) =>
        cmp.id === complaintId
          ? {
              ...cmp,
              status,
              adminNotes: adminNotes || cmp.adminNotes,
              resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : cmp.resolvedAt,
            }
          : cmp
      )
    );
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        restaurants,
        foods,
        promotions,
        platformSettings,
        reviews,
        complaints,
        // Restaurant actions
        applyRestaurantRegistration,
        approveRestaurant,
        rejectRestaurant,
        suspendRestaurant,
        activateRestaurant,
        updateRestaurantProfile,
        toggleRestaurantOpenStatus,
        // Food CRUD
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        updateFoodStock,
        // Promo actions
        addPromotion,
        togglePromotion,
        deletePromotion,
        // Settings
        updatePlatformSettings,
        // Feedback
        addReview,
        respondToReview,
        addComplaint,
        updateComplaintStatus,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}

