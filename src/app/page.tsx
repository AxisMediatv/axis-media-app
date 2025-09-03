'use client';

import { useState } from 'react';
import SportsCategories from '@/components/SportsCategories';
import SportCategoryView from '@/components/SportCategoryView';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const resetApp = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 
              onClick={resetApp}
              className="text-2xl font-bold text-white cursor-pointer hover:text-teal-400 transition-colors"
            >
              Axis Media App
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCategory ? (
          <SportsCategories
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        ) : (
          <SportCategoryView
            category={selectedCategory}
            onBack={handleBackToCategories}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            © 2025 Axis Media App
          </div>
        </div>
      </footer>
    </div>
  );
}
