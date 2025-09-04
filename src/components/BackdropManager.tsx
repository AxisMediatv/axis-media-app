'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, Download, X, Play, Image as ImageIcon, Trash2 } from 'lucide-react';

export interface Backdrop {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  category: string;
  uploadedAt: Date;
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
  const [newBackdropTitle, setNewBackdropTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default images from public folder
  const loadDefaultBackdrops = async () => {
    const defaultBackdrops: Record<string, Backdrop[]> = {
      'snow': [
        { id: 'snow-1', title: 'Snow Mountain Peak', type: 'image', url: '/backdrops/snow/snow-backdrop-1.png', category: 'snow', uploadedAt: new Date() },
        { id: 'snow-2', title: 'Snowy Forest Trail', type: 'image', url: '/backdrops/snow/snow-backdrop-2.png', category: 'snow', uploadedAt: new Date() },
        { id: 'snow-3', title: 'Winter Landscape', type: 'image', url: '/backdrops/snow/snow-backdrop-3.png', category: 'snow', uploadedAt: new Date() },
        { id: 'snow-4', title: 'Alpine Snow Scene', type: 'image', url: '/backdrops/snow/snow-backdrop-4.png', category: 'snow', uploadedAt: new Date() },
      ],
      // Add more categories as you add images
    };

    const categoryBackdrops = defaultBackdrops[category] || [];
    setBackdrops(categoryBackdrops);
  };

  // Load default backdrops when component mounts
  useEffect(() => {
    loadDefaultBackdrops();
  }, [category]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        alert(`${file.name} is not a valid image or video file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newBackdrop: Backdrop = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: newBackdropTitle || file.name.split('.')[0],
          type: isVideo ? 'video' : 'image',
          url,
          category,
          uploadedAt: new Date(),
        };

        setBackdrops(prev => [...prev, newBackdrop]);
        setNewBackdropTitle('');
      };
      reader.readAsDataURL(file);
    });
    
    setIsUploading(false);
  };

  const handleDownload = (backdrop: Backdrop) => {
    const link = document.createElement('a');
    link.download = `${backdrop.title}.${backdrop.type === 'video' ? 'mp4' : 'jpg'}`;
    link.href = backdrop.url;
    link.click();
  };

  const handleDelete = (backdropId: string) => {
    setBackdrops(prev => prev.filter(b => b.id !== backdropId));
  };

  const uploadClick = () => {
    fileInputRef.current?.click();
  };

  if (embedded) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Download Backdrops</h2>
          <p className="text-gray-400 mb-6">Browse and download high-quality backdrops for your {category.toUpperCase()} content, or upload your own.</p>
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
          <h3 className="text-lg font-semibold text-white mb-4">Upload New Backdrop</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Backdrop title (optional)"
              value={newBackdropTitle}
              onChange={(e) => setNewBackdropTitle(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
            />
            <button
              onClick={uploadClick}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 text-black disabled:text-gray-400 rounded font-medium transition-colors"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Supports images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        )}

        {/* Backdrops Grid */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Backdrops ({backdrops.length})
          </h3>
          
          {/* Category Headers */}
          <div className="mb-6 space-y-2">
            <h3 className="text-lg font-semibold text-white mb-4">Images (1)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">Videos (0)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">Pictures (1)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">B-Roll (1)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">Studio Backdrops (1)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">Intro Videos (0)</h3>
            <h3 className="text-lg font-semibold text-white mb-4">Outro Videos/Credits (0)</h3>
          </div>
          
          {backdrops.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p>No backdrops uploaded yet</p>
              <p className="text-sm">Upload some images or videos to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {backdrops.map((backdrop) => (
                <div key={backdrop.id} className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-gray-700">
                    {backdrop.type === 'image' ? (
                      <img
                        src={backdrop.url}
                        alt={backdrop.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <video
                          src={backdrop.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        backdrop.type === 'video' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {backdrop.type === 'video' ? 'VIDEO' : 'IMAGE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-white text-sm mb-2 truncate">
                      {backdrop.title}
                    </h4>
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