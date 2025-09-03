'use client';

export interface SportCategory {
  id: string;
  name: string;
  icon: string;
}

export const sportsCategories: SportCategory[] = [
  { id: 'snow', name: 'SNOW', icon: '❄️' },
  { id: 'freeski', name: 'FREESKI', icon: '🎿' },
  { id: 'skate', name: 'SKATE', icon: '🛹' },
  { id: 'surf', name: 'SURF', icon: '🏄' },
  { id: 'mtb', name: 'MTB', icon: '🚵' },
  { id: 'bmx', name: 'BMX', icon: '🚴' },
  { id: 'climb', name: 'CLIMB', icon: '🧗' },
  { id: 'ski', name: 'SKI', icon: '⛷️' },
  { id: 'parkour', name: 'PARKOUR', icon: '🏃' },
  { id: 'all-axis', name: 'ALL AXIS', icon: '🎯' },
];

interface SportsCategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export default function SportsCategories({ selectedCategory, onCategorySelect }: SportsCategoriesProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Select Sports Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sportsCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              hover:scale-105 hover:shadow-lg
              ${selectedCategory === category.id 
                ? 'border-teal-400 bg-gray-800 shadow-lg shadow-teal-400/20' 
                : 'border-gray-600 bg-gray-900 hover:border-teal-500 hover:bg-gray-800'
              }
            `}
          >
            <span className="text-3xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium text-center text-white">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}