'use client';

import { useState } from 'react';
import SportsCategories from '@/components/SportsCategories';
import ImageUpload from '@/components/ImageUpload';
import ImageResizer from '@/components/ImageResizer';
import ThumbnailMaker from '@/components/ThumbnailMaker';
import { ChevronRight, Camera, Maximize2, Grid3x3 } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'resize' | 'thumbnail'>('resize');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep(2);
  };

  const handleImageSelect = (file: File, preview: string) => {
    setOriginalFile(file);
    setSelectedImage(preview);
    setStep(3);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setOriginalFile(null);
    setStep(2);
  };

  const resetApp = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedImage(null);
    setOriginalFile(null);
    setActiveTab('resize');
  };

  const steps = [
    { id: 1, name: 'Category', icon: Grid3x3 },
    { id: 2, name: 'Upload', icon: Camera },
    { id: 3, name: 'Process', icon: Maximize2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 
              onClick={resetApp}
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            >
              Axis Media App
            </h1>
            
            {/* Progress Steps */}
            <nav className="flex items-center space-x-4">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = step === stepItem.id;
                const isCompleted = step > stepItem.id;
                
                return (
                  <div key={stepItem.id} className="flex items-center">
                    <div className={`
                      flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : isCompleted 
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <Icon className="h-4 w-4" />
                      {stepItem.name}
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <SportsCategories
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {step === 2 && (
          <>
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Categories
              </button>
              {selectedCategory && (
                <p className="text-gray-600 mt-1">
                  Selected category: <span className="font-medium capitalize">{selectedCategory}</span>
                </p>
              )}
            </div>
            
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onImageRemove={handleImageRemove}
            />
          </>
        )}

        {step === 3 && selectedImage && originalFile && selectedCategory && (
          <>
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Upload
              </button>
              <p className="text-gray-600 mt-1">
                Category: <span className="font-medium capitalize">{selectedCategory}</span> | 
                File: <span className="font-medium">{originalFile.name}</span>
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('resize')}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === 'resize'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4" />
                      Image Resizer
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('thumbnail')}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === 'thumbnail'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="h-4 w-4" />
                      Thumbnail Maker
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'resize' ? (
              <ImageResizer
                originalImage={selectedImage}
                selectedCategory={selectedCategory}
                originalFile={originalFile}
              />
            ) : (
              <ThumbnailMaker
                originalImage={selectedImage}
                selectedCategory={selectedCategory}
                originalFile={originalFile}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Axis Media App - Resize your sports photos with ease
          </div>
        </div>
      </footer>
    </div>
  );
}
