// API configuration placeholder
// This file centralises the backend URL so that switching to a real API
// later (e.g. Spring Boot) requires changing only this file.

const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // placeholder for Spring Boot backend
  ENDPOINTS: {
    FOODS: '/foods',
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    ORDER_BY_ID: (id) => `/orders/${id}`,
    RECOMMENDATIONS: '/recommendations',
  },
};

export default API_CONFIG;

