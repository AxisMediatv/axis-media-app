'use client';

import { useState } from 'react';
import { Upload, Download, Grid3x3, Maximize2, ArrowLeft } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ImageResizer from './ImageResizer';
import ThumbnailMaker from './ThumbnailMaker';
import BackdropManager from './BackdropManager';

interface SportCategoryViewProps {
  category: string;
  onBack: () => void;
}

type TabType = 'upload' | 'download' | 'thumbnail' | 'resize';

export default function SportCategoryView({ category, onBack }: SportCategoryViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setOriginalFile(file);
    setSelectedImage(preview);
    // Auto-switch to resize tab after upload
    setActiveTab('resize');
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setOriginalFile(null);
  };

  const tabs = [
    { id: 'upload' as TabType, name: 'Upload', icon: Upload },
    { id: 'download' as TabType, name: 'Download Images', icon: Download },
    { id: 'thumbnail' as TabType, name: 'Thumbnail', icon: Grid3x3 },
    { id: 'resize' as TabType, name: 'Resize Your Image', icon: Maximize2 },
  ];

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      'snow': '❄️',
      'freeski': '🎿',
      'skate': '🛹',
      'surf': '🏄',
      'mtb': '🚵',
      'bmx': '🚴',
      'climb': '🧗',
      'ski': '⛷️',
      'parkour': '🏃',
      'all-axis': '🎯',
    };
    return icons[categoryId] || '🎯';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Categories
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getCategoryIcon(category)}</span>
          <h1 className="text-3xl font-bold text-white">{category.toUpperCase()}</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-600">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-teal-400 text-teal-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'upload' && (
          <div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onImageRemove={handleImageRemove}
            />
            {selectedImage && (
              <div className="mt-6 text-center">
                <p className="text-gray-300 mb-4">Great! Your image is uploaded.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('resize')}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black rounded font-medium transition-colors"
                  >
                    Resize Image →
                  </button>
                  <button
                    onClick={() => setActiveTab('thumbnail')}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition-colors"
                  >
                    Create Thumbnails →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'download' && (
          <BackdropManager
            category={category}
            onClose={() => {}} // Empty since it's embedded, not a modal
            embedded={true}
          />
        )}

        {activeTab === 'thumbnail' && (
          <div>
            {!selectedImage ? (
              <div className="text-center py-12">
                <Grid3x3 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Create Thumbnails</h3>
                <p className="text-gray-400 mb-4">Upload an image first to create thumbnails</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black rounded font-medium transition-colors"
                >
                  Upload Image
                </button>
              </div>
            ) : (
              <ThumbnailMaker
                originalImage={selectedImage}
                selectedCategory={category}
                originalFile={originalFile!}
              />
            )}
          </div>
        )}

        {activeTab === 'resize' && (
          <div>
            {!selectedImage ? (
              <div className="text-center py-12">
                <Maximize2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Resize Your Image</h3>
                <p className="text-gray-400 mb-4">Upload an image first to resize it</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black rounded font-medium transition-colors"
                >
                  Upload Image
                </button>
              </div>
            ) : (
              <ImageResizer
                originalImage={selectedImage}
                selectedCategory={category}
                originalFile={originalFile!}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}