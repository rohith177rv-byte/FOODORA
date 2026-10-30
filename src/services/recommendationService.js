// Recommendation service – rule-based engine for food recommendations.
// Separated from UI so a real AI API can be swapped in later.
// Future: POST /api/recommendations with user preferences

import foodData from '../data/foodData.js';

/**
 * Generate food recommendations based on user preferences.
 * Uses a rule-based scoring engine. Can be replaced with an AI API call later.
 *
 * @param {{ foodPref: string, cuisine: string, budget: string, taste: string, mealType: string }} preferences
 * @returns {Promise<Array>} Array of { ...food, matchScore, matchReason }
 */
export async function getRecommendations(preferences) {
  // Simulate processing delay for AI-like UX
  return new Promise((resolve) => {
    setTimeout(() => {
      const scored = foodData
        .map((food) => {
          let score = 0;
          const reasons = [];

          // Food preference filter
          if (preferences.foodPref === 'Vegetarian') {
            if (!food.isVeg) {
              return null; // exclude non-veg
            }
            score += 2;
            reasons.push('Matches your vegetarian preference');
          } else if (preferences.foodPref === 'Non-vegetarian') {
            if (food.isVeg) {
              score += 0;
            } else {
              score += 2;
              reasons.push('Non-vegetarian choice');
            }
          } else {
            score += 1; // "Both" preference
          }

          // Cuisine filter
          if (preferences.cuisine === 'Any' || preferences.cuisine === food.category) {
            score += 3;
            if (preferences.cuisine !== 'Any') {
              reasons.push(`Matches your ${food.category} cuisine preference`);
            }
          }

          // Budget filter
          const budgetMatch = checkBudget(food.price, preferences.budget);
          if (budgetMatch) {
            score += 3;
            reasons.push('Within your budget range');
          } else {
            score -= 2;
          }

          // Taste preference
          if (preferences.taste === food.taste) {
            score += 2;
            reasons.push(`${food.taste} flavour you love`);
          }

          // Meal type
          if (food.mealType.includes(preferences.mealType)) {
            score += 2;
            reasons.push(`Perfect for ${preferences.mealType.toLowerCase()}`);
          }

          // Rating bonus
          if (food.rating >= 4.5) {
            score += 1;
            reasons.push('Highly rated by customers');
          }

          // Best seller bonus
          if (food.isBestSeller) {
            score += 1;
            reasons.push('Best seller');
          }

          if (reasons.length === 0) {
            reasons.push('You might enjoy this based on similar preferences');
          }

          return {
            ...food,
            matchScore: score,
            matchReason: reasons.slice(0, 3).join(' · '),
          };
        })
        .filter(Boolean)
        .filter((item) => item.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);

      // Fallback: if very few items matched, supply top rated items matching veg preference
      if (scored.length === 0) {
        const fallback = foodData
          .filter((f) => {
            if (preferences.foodPref === 'Vegetarian') return f.isVeg;
            if (preferences.foodPref === 'Non-vegetarian') return !f.isVeg;
            return true;
          })
          .slice(0, 4)
          .map((f) => ({
            ...f,
            matchScore: 1,
            matchReason: 'Curated popular choice you might love',
          }));
        resolve(fallback);
        return;
      }

      resolve(scored);
    }, 1500); // Simulated AI processing time
  });
}

/**
 * Check if a food price falls within the selected budget range.
 */
function checkBudget(price, budget) {
  switch (budget) {
    case 'Under ₹100':
      return price < 100;
    case '₹100–₹200':
      return price >= 100 && price <= 200;
    case '₹200–₹500':
      return price >= 200 && price <= 500;
    case 'Above ₹500':
      return price > 500;
    default:
      return true;
  }
}

