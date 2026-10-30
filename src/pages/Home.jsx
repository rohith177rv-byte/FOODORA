import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Clock, Truck, Shield, ChefHat } from 'lucide-react';
import FoodCard from '../components/FoodCard.jsx';
import { getBestSellers, getTrendingFoods } from '../services/foodService.js';
import { categories, testimonials, specialOffers } from '../data/foodData.js';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [bs, tr] = await Promise.all([getBestSellers(), getTrendingFoods()]);
      setBestSellers(bs);
      setTrending(tr);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9F3] via-white to-orange-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 rounded-full opacity-60 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-[#FF6B35] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Sparkles size={14} />
                AI-Powered Recommendations
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Good Food.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB347]">
                  Great Mood.
                </span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                Discover delicious meals, explore new flavours and find your next favourite dish with our AI-powered platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-orange-200 active:scale-95"
                >
                  Explore Menu
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/recommendations"
                  className="inline-flex items-center gap-2 bg-white text-[#FF6B35] border-2 border-[#FF6B35] px-7 py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 active:scale-95"
                >
                  <Sparkles size={18} />
                  Discover Your Taste
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { value: '500+', label: 'Dishes' },
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '4.8', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                  alt="Delicious food spread"
                  className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FFB347]/20 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: 'Fast Delivery', desc: '30 min average' },
              { icon: Shield, label: 'Hygienic Food', desc: '100% safe' },
              { icon: Truck, label: 'Free Delivery', desc: 'Above ₹299' },
              { icon: ChefHat, label: 'Top Chefs', desc: 'Expert cooks' },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <feat.icon size={20} className="text-[#FF6B35]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{feat.label}</p>
                  <p className="text-xs text-gray-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Categories</h2>
          <p className="text-gray-500">Browse our wide range of cuisines</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {categories.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to="/menu"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6B35] hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF6B35]">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Special Offers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-r ${offer.bgColor} rounded-2xl p-6 text-white`}
            >
              <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
              <p className="text-white/90 text-sm mb-3">{offer.description}</p>
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg text-sm font-mono font-bold">
                {offer.code}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Best Sellers</h2>
            <p className="text-gray-500">Most loved dishes by our customers</p>
          </div>
          <Link to="/menu" className="hidden sm:flex items-center gap-1 text-[#FF6B35] font-semibold text-sm hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Trending Now 🔥</h2>
              <p className="text-gray-500">What everyone is ordering right now</p>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-1 text-[#FF6B35] font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.slice(0, 4).map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Hear from the FOODORA community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FFB347] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <span className="font-semibold text-gray-800 text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
