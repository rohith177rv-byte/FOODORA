import { useState } from 'react';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard.jsx';
import { getRecommendations } from '../services/recommendationService.js';

const FOOD_PREFS = ['Vegetarian', 'Non-vegetarian', 'Both'];
const CUISINES = ['Indian', 'Chinese', 'Italian', 'Fast Food', 'Any'];
const BUDGETS = ['Under ₹100', '₹100–₹200', '₹200–₹500', 'Above ₹500'];
const TASTES = ['Spicy', 'Mild', 'Sweet', 'Healthy'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function Recommendations() {
  const [preferences, setPreferences] = useState({
    foodPref: '',
    cuisine: '',
    budget: '',
    taste: '',
    mealType: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const updatePref = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const isComplete = Object.values(preferences).every((v) => v !== '');

  const handleGenerate = async () => {
    if (!isComplete) return;
    setLoading(true);
    setGenerated(false);
    const recs = await getRecommendations(preferences);
    setResults(recs);
    setLoading(false);
    setGenerated(true);
  };

  const handleReset = () => {
    setPreferences({ foodPref: '', cuisine: '', budget: '', taste: '', mealType: '' });
    setResults(null);
    setGenerated(false);
  };

  const renderOptions = (options, key) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => updatePref(key, opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            preferences[key] === opt
              ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-[#FF6B35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Brain size={28} />
            <h1 className="text-3xl md:text-4xl font-extrabold">Find Your Perfect Meal</h1>
          </div>
          <p className="text-white/80 text-lg">Tell us what you love. We'll help you discover something delicious.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Preference Form */}
        {!generated && (
          <div className="space-y-8">
            {/* Note about demo */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-sm text-purple-700">
              <span className="font-semibold">Demo Mode:</span> This version uses a rule-based recommendation engine. In production, this will be powered by an AI API for personalised suggestions.
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">1. Food Preference</h3>
              {renderOptions(FOOD_PREFS, 'foodPref')}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">2. Preferred Cuisine</h3>
              {renderOptions(CUISINES, 'cuisine')}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">3. Budget</h3>
              {renderOptions(BUDGETS, 'budget')}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">4. Taste Preference</h3>
              {renderOptions(TASTES, 'taste')}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">5. Meal Type</h3>
              {renderOptions(MEAL_TYPES, 'mealType')}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isComplete || loading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isComplete
                  ? 'bg-gradient-to-r from-purple-600 to-[#FF6B35] text-white hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate My Recommendations
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-[#FF6B35]" />
              <Sparkles size={24} className="absolute inset-0 m-auto text-[#FF6B35] animate-pulse" />
            </div>
            <p className="mt-6 text-gray-600 font-medium animate-pulse">Analyzing your preferences...</p>
            <p className="text-sm text-gray-400 mt-1">Finding the best dishes for you</p>
          </div>
        )}
      </div>

      {/* Results */}
      {generated && results && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              ✅ Analysis Complete
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Your Personalised Recommendations
            </h2>
            <p className="text-gray-500">
              Based on your preferences, we found <span className="font-semibold text-[#FF6B35]">{results.length}</span> perfect match{results.length !== 1 ? 'es' : ''}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {results.map((food) => (
                <RecommendationCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-5xl mb-4">😔</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No exact matches found</h3>
              <p className="text-gray-500">Try adjusting your preferences for better results</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-white text-[#FF6B35] border-2 border-[#FF6B35] px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all"
            >
              <Sparkles size={18} />
              Try Different Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
