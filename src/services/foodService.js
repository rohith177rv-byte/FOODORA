// Food service – abstracts data access for food items.
// Currently uses local data; can be swapped with API calls later.
// Future: GET /api/foods, GET /api/categories

import foodData, { categories } from '../data/foodData.js';

/**
 * Fetch all food items.
 * @returns {Promise<Array>}
 */
export async function getAllFoods() {
  // Simulates network delay for realistic UX
  return new Promise((resolve) => {
    setTimeout(() => resolve([...foodData]), 300);
  });
}

/**
 * Get a single food item by ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function getFoodById(id) {
  return new Promise((resolve) => {
    const food = foodData.find((f) => f.id === id) || null;
    setTimeout(() => resolve(food), 100);
  });
}

/**
 * Get all available categories.
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...categories]), 100);
  });
}

/**
 * Search foods by name (case-insensitive).
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchFoods(query) {
  return new Promise((resolve) => {
    const results = foodData.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );
    setTimeout(() => resolve(results), 200);
  });
}

/**
 * Filter foods by criteria.
 * @param {{ category?: string, isVeg?: boolean|null, sortBy?: string }} filters
 * @returns {Promise<Array>}
 */
export async function filterFoods(filters = {}) {
  return new Promise((resolve) => {
    let results = [...foodData];

    if (filters.category && filters.category !== 'all') {
      results = results.filter((f) => f.category === filters.category);
    }

    if (filters.isVeg === true) {
      results = results.filter((f) => f.isVeg === true);
    } else if (filters.isVeg === false) {
      results = results.filter((f) => f.isVeg === false);
    }

    if (filters.sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setTimeout(() => resolve(results), 200);
  });
}

/**
 * Get best seller items.
 * @returns {Promise<Array>}
 */
export async function getBestSellers() {
  return new Promise((resolve) => {
    const results = foodData.filter((f) => f.isBestSeller);
    setTimeout(() => resolve(results), 200);
  });
}

/**
 * Get trending items.
 * @returns {Promise<Array>}
 */
export async function getTrendingFoods() {
  return new Promise((resolve) => {
    const results = foodData.filter((f) => f.isTrending);
    setTimeout(() => resolve(results), 200);
  });
}

