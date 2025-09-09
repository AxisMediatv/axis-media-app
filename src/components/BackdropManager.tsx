'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, Download, X, Play, Image as ImageIcon, Trash2, Check, Music, Video } from 'lucide-react';

export interface Backdrop {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  category: string;
  uploadedAt: Date;
  mediaType?: string;
  uploadedBy?: string;
}

interface BackdropManagerProps {
  category: string;
  onClose: () => void;
  embedded?: boolean;
  downloadOnly?: boolean;
}

export default function BackdropManager({ category, onClose, embedded = false, downloadOnly = false }: BackdropManagerProps) {
  const [backdrops, setBackdrops] = useState<Backdrop[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newBackdropTitle, setNewBackdropTitle] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default images from public folder
  const loadDefaultBackdrops = async () => {
    const defaultBackdrops: Record<string, Backdrop[]> = {
      'snow': [
        // Assets category
        { id: 'asset-1', title: 'HEX', type: 'image', url: '/Assets/Assets/HEX.png', category: 'snow', mediaType: 'assets', uploadedAt: new Date() },
        { id: 'asset-2', title: 'icon', type: 'image', url: '/Assets/Assets/icon.png', category: 'snow', mediaType: 'assets', uploadedAt: new Date() },
        { id: 'asset-3', title: 'SNOW logo', type: 'image', url: '/Assets/Assets/SNOW logo.png', category: 'snow', mediaType: 'assets', uploadedAt: new Date() },
        // Photos category
        { id: 'photo-1', title: 'Photo 1', type: 'image', url: '/Assets/Photos/Photo 1.png', category: 'snow', mediaType: 'photos', uploadedAt: new Date() },
        { id: 'photo-2', title: 'Photo 2', type: 'image', url: '/Assets/Photos/Photo 2.png', category: 'snow', mediaType: 'photos', uploadedAt: new Date() },
        { id: 'photo-3', title: 'Photo3', type: 'image', url: '/Assets/Photos/Photo3.png', category: 'snow', mediaType: 'photos', uploadedAt: new Date() },
        { id: 'photo-4', title: 'Photo 4', type: 'image', url: '/Assets/Photos/Photo 4.png', category: 'snow', mediaType: 'photos', uploadedAt: new Date() },
        // B-roll category
        { id: 'broll-1', title: 'B-roll 1', type: 'video', url: '/Assets/B-roll/B-roll 1.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-2', title: 'B-roll 2', type: 'video', url: '/Assets/B-roll/B-roll 2.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-3', title: 'B-roll 3', type: 'video', url: '/Assets/B-roll/B-roll 3.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-4', title: 'B-roll 4', type: 'video', url: '/Assets/B-roll/B-roll 4.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-5', title: 'B-roll 5', type: 'video', url: '/Assets/B-roll/B-roll 5.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-6', title: 'B-roll 6', type: 'video', url: '/Assets/B-roll/B-roll 6.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        { id: 'broll-7', title: 'B-roll 7', type: 'video', url: '/Assets/B-roll/B-roll 7.mp4', category: 'snow', mediaType: 'b-roll', uploadedAt: new Date() },
        // Studio Backdrops category
        { id: 'studio-1', title: 'Studio Image', type: 'image', url: '/Assets/Studio Backdrops/Studio Image.png', category: 'snow', mediaType: 'studio-backdrops', uploadedAt: new Date() },
        { id: 'studio-2', title: 'Studio Video', type: 'video', url: '/Assets/Studio Backdrops/Studio Video.mp4', category: 'snow', mediaType: 'studio-backdrops', uploadedAt: new Date() },
        // Wallpaper Image category
        { id: 'wallpaper-img-1', title: 'Wallpaper Image 1', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 1.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-2', title: 'Wallpaper Image 2', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 2.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-3', title: 'Wallpaper Image 3', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 3.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-4', title: 'Wallpaper Image 4', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 4.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-5', title: 'Wallpaper Image 5', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 5.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-6', title: 'Wallpaper Image 6', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 6.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-7', title: 'Wallpaper Image 7', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 7.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
        { id: 'wallpaper-img-8', title: 'Wallpaper Image 8', type: 'image', url: '/Assets/Wallpaper Image/Wallpaper Image 8.png', category: 'snow', mediaType: 'wallpaper-image', uploadedAt: new Date() },
      ],
    };

    const categoryBackdrops = defaultBackdrops[category] || [];
    setBackdrops(categoryBackdrops);
  };

  // Load default backdrops when component mounts
  useEffect(() => {
    loadDefaultBackdrops();
  }, [category]);

  const handleFileSelect = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');
    
    if (!isVideo && !isImage && !isAudio) {
      alert(`${file.name} is not a valid image, video, or audio file.`);
      return;
    }

    setSelectedFile(file);
    if (!newBackdropTitle) {
      setNewBackdropTitle(file.name.split('.')[0]);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file) {
      handleFileSelect(file);
    }
  };

  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.muted = true;
      video.crossOrigin = 'anonymous';
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.7);
          URL.revokeObjectURL(video.src);
          resolve(dataURL);
        } else {
          reject(new Error('Canvas context failed'));
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Video failed to load'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      alert('Please select a file and category before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for file reading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const reader = new FileReader();
      reader.onload = async (e) => {
        setUploadProgress(95);
        const url = e.target?.result as string;
        let thumbnail: string | undefined;
        
        // Generate simple video thumbnail
        if (selectedFile.type.startsWith('video/')) {
          try {
            thumbnail = await createVideoThumbnail(selectedFile);
          } catch (error) {
            console.log('Thumbnail generation failed, using default icon');
            thumbnail = undefined;
          }
        }
        
        const newBackdrop: Backdrop = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: newBackdropTitle || selectedFile.name.split('.')[0],
          type: selectedFile.type.startsWith('video/') ? 'video' : 
                selectedFile.type.startsWith('audio/') ? 'audio' : 'image',
          url,
          thumbnail,
          category,
          uploadedAt: new Date(),
          uploadedBy: uploaderName || undefined,
          mediaType: selectedCategory,
        };

        setBackdrops(prev => [...prev, newBackdrop]);
        setUploadProgress(100);
        
        // Clear form after a short delay to show 100%
        setTimeout(() => {
          setSelectedFile(null);
          setNewBackdropTitle('');
          setUploaderName('');
          setSelectedCategory('');
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = (backdrop: Backdrop) => {
    const link = document.createElement('a');
    const extension = backdrop.type === 'video' ? 'mp4' : 
                     backdrop.type === 'audio' ? 'mp3' : 'jpg';
    link.download = `${backdrop.title}.${extension}`;
    link.href = backdrop.url;
    link.click();
  };

  const handleDelete = (backdropId: string) => {
    setBackdrops(prev => prev.filter(b => b.id !== backdropId));
  };


  // Filter categories
  const filterCategories = [
    { id: 'assets', name: 'Assets' },
    { id: 'audio', name: 'Audio' },
    { id: 'b-roll', name: 'B-Roll' },
    { id: 'images', name: 'Images' },
    { id: 'intro-videos', name: 'Intro Videos' },
    { id: 'outro-videos', name: 'Outro Videos/Credits' },
    { id: 'photos', name: 'Photos' },
    { id: 'studio-backdrops', name: 'Studio Backdrops' },
    { id: 'transitions', name: 'Transitions' },
    { id: 'videos', name: 'Videos' },
    { id: 'wallpaper-image', name: 'Wallpaper Image' },
    { id: 'wallpaper-video', name: 'Wallpaper Video' },
  ];

  const toggleFilter = (categoryId: string) => {
    setSelectedFilters(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryCount = (categoryId: string) => {
    return backdrops.filter(backdrop => {
      // Match exact category selected by user during upload
      return backdrop.mediaType === categoryId;
    }).length;
  };

  const toggleSelectAll = () => {
    if (selectedFilters.length === filterCategories.length) {
      // If all are selected, deselect all
      setSelectedFilters([]);
    } else {
      // Select all categories
      setSelectedFilters(filterCategories.map(cat => cat.id));
    }
  };

  const isAllSelected = selectedFilters.length === filterCategories.length;

  const filteredBackdrops = selectedFilters.length === 0 
    ? [] 
    : backdrops.filter(backdrop => {
        // Match exact category selected by user during upload
        return selectedFilters.includes(backdrop.mediaType || '');
      });

  if (embedded) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Media</h2>
        </div>
        <div className="space-y-8">{renderContent()}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-600 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-white">
            {category.toUpperCase()} Backdrops
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{renderContent()}</div>
      </div>
    </div>
  );

  function renderContent() {
    return (
      <>
        {/* Upload Section */}
        {!downloadOnly && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Upload New Media</h3>
          
          {/* Step 1: Choose Media */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">1. Choose Media</label>
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                ${isDragging 
                  ? 'border-teal-400 bg-gray-800' 
                  : 'border-gray-600 hover:border-teal-500 bg-gray-900'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              {selectedFile ? (
                <div>
                  <p className="text-teal-400 font-medium mb-1">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">Click to choose a different file</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium mb-1">Drop your media here or click to browse</p>
                  <p className="text-gray-400 text-sm">Supports JPG, PNG, GIF, WebP, MP4, WebM, MOV, MP3, WAV, FLAC</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Step 2: Media Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">2. Media Title (optional)</label>
            <input
              type="text"
              placeholder="Media title (defaults to filename)"
              value={newBackdropTitle}
              onChange={(e) => setNewBackdropTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          {/* Step 3: Uploader Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">3. Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          {/* Step 4: Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">4. Category *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              required
            >
              <option value="">Select a category...</option>
              <option value="assets">Assets</option>
              <option value="audio">Audio</option>
              <option value="b-roll">B-Roll</option>
              <option value="images">Images</option>
              <option value="intro-videos">Intro Videos</option>
              <option value="outro-videos">Outro Videos/Credits</option>
              <option value="photos">Photos</option>
              <option value="studio-backdrops">Studio Backdrops</option>
              <option value="transitions">Transitions</option>
              <option value="videos">Videos</option>
              <option value="wallpaper-image">Wallpaper Image</option>
              <option value="wallpaper-video">Wallpaper Video</option>
            </select>
          </div>

          {/* Step 5: Upload Button */}
          <div className="mb-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile || !selectedCategory}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 text-black disabled:text-gray-400 rounded font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
            
            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Backdrops Grid */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">
            Available Media ({filteredBackdrops.length})
          </h3>
          
          {/* Filter Buttons */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Filter by category:</h4>
            <div className="flex flex-wrap gap-3">
              {/* All Button */}
              <button
                onClick={toggleSelectAll}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 font-medium text-sm
                  ${isAllSelected
                    ? 'bg-teal-500 border-teal-500 text-black hover:bg-teal-400 hover:border-teal-400 shadow-lg'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white'
                  }
                `}
              >
                {isAllSelected && <Check className="h-4 w-4" />}
                <span>All</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isAllSelected 
                    ? 'bg-black bg-opacity-20 text-black' 
                    : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {backdrops.length}
                </span>
              </button>
              
              {filterCategories.map((filterCategory) => {
                const isSelected = selectedFilters.includes(filterCategory.id);
                const count = getCategoryCount(filterCategory.id);
                
                return (
                  <button
                    key={filterCategory.id}
                    onClick={() => toggleFilter(filterCategory.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 font-medium text-sm
                      ${isSelected
                        ? 'bg-teal-500 border-teal-500 text-black hover:bg-teal-400 hover:border-teal-400 shadow-lg'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white'
                      }
                    `}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    <span>{filterCategory.name}</span>
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${isSelected 
                        ? 'bg-black bg-opacity-20 text-black' 
                        : 'bg-gray-700 text-gray-400'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedFilters.length === 0 && (
              <p className="text-gray-500 text-sm mt-3 italic">Select categories above to view media</p>
            )}
          </div>
          
          {filteredBackdrops.length === 0 && selectedFilters.length > 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p>No media found for selected categories</p>
              <p className="text-sm">Try selecting different categories or upload new media</p>
            </div>
          ) : selectedFilters.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p>Select categories above to view media</p>
              <p className="text-sm">Choose one or more categories to filter the available backdrops</p>
            </div>
          ) : filteredBackdrops.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p>No backdrops uploaded yet</p>
              <p className="text-sm">Upload some images or videos to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredBackdrops.map((backdrop) => (
                <div key={backdrop.id} className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-gray-700">
                    {backdrop.type === 'image' ? (
                      <img
                        src={backdrop.url}
                        alt={backdrop.title}
                        className="w-full h-full object-cover"
                      />
                    ) : backdrop.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <video
                          src={backdrop.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                        <Music className="h-12 w-12 text-white" />
                        <audio
                          src={backdrop.url}
                          className="hidden"
                          preload="none"
                        />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        backdrop.type === 'video' 
                          ? 'bg-purple-500 text-white'
                          : backdrop.type === 'audio'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {backdrop.type === 'video' ? 'VIDEO' : backdrop.type === 'audio' ? 'AUDIO' : 'IMAGE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-white text-sm mb-1 truncate">
                      {backdrop.title}
                    </h4>
                    {backdrop.uploadedBy && (
                      <p className="text-xs text-gray-400 mb-2 truncate">
                        by {backdrop.uploadedBy}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(backdrop)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-teal-500 hover:bg-teal-600 text-black text-xs rounded font-medium transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(backdrop.id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}