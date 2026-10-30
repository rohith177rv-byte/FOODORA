import { categories } from '../data/foodData.js';

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
            selectedCategory === cat.id
              ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35] border border-gray-200'
          }`}
        >
          <span className="text-lg">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
