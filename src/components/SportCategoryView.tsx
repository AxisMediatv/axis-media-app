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
  
  // Main upload (for Upload tab)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  // Thumbnail upload
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Resize upload
  const [resizeImage, setResizeImage] = useState<string | null>(null);
  const [resizeFile, setResizeFile] = useState<File | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setOriginalFile(file);
    setSelectedImage(preview);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setOriginalFile(null);
  };

  const handleThumbnailImageSelect = (file: File, preview: string) => {
    setThumbnailFile(file);
    setThumbnailImage(preview);
  };

  const handleThumbnailImageRemove = () => {
    setThumbnailImage(null);
    setThumbnailFile(null);
  };

  const handleResizeImageSelect = (file: File, preview: string) => {
    setResizeFile(file);
    setResizeImage(preview);
  };

  const handleResizeImageRemove = () => {
    setResizeImage(null);
    setResizeFile(null);
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">General Image Upload</h2>
              <p className="text-gray-400 mb-6">
                Upload images here for general use. For specific functions, use the dedicated upload areas in Thumbnail and Resize tabs.
              </p>
            </div>
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Create Thumbnails</h2>
              <p className="text-gray-400 mb-6">
                Upload an image specifically for thumbnail creation. Generate multiple thumbnail sizes for your content.
              </p>
            </div>
            
            {!thumbnailImage ? (
              <ImageUpload
                onImageSelect={handleThumbnailImageSelect}
                selectedImage={thumbnailImage}
                onImageRemove={handleThumbnailImageRemove}
              />
            ) : (
              <>
                <div className="mb-6">
                  <ImageUpload
                    onImageSelect={handleThumbnailImageSelect}
                    selectedImage={thumbnailImage}
                    onImageRemove={handleThumbnailImageRemove}
                  />
                </div>
                <ThumbnailMaker
                  originalImage={thumbnailImage}
                  selectedCategory={category}
                  originalFile={thumbnailFile!}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'resize' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Resize Your Image</h2>
              <p className="text-gray-400 mb-6">
                Upload an image specifically for resizing. Choose from preset dimensions or create custom sizes.
              </p>
            </div>
            
            {!resizeImage ? (
              <ImageUpload
                onImageSelect={handleResizeImageSelect}
                selectedImage={resizeImage}
                onImageRemove={handleResizeImageRemove}
              />
            ) : (
              <>
                <div className="mb-6">
                  <ImageUpload
                    onImageSelect={handleResizeImageSelect}
                    selectedImage={resizeImage}
                    onImageRemove={handleResizeImageRemove}
                  />
                </div>
                <ImageResizer
                  originalImage={resizeImage}
                  selectedCategory={category}
                  originalFile={resizeFile!}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}