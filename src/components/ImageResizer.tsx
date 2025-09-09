'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, RotateCw, Image as ImageIcon } from 'lucide-react';

export interface ResizeOption {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

export const resizeOptions: ResizeOption[] = [
  { id: 'social-square', name: 'Social Square', width: 1080, height: 1080, description: 'Instagram posts' },
  { id: 'social-story', name: 'Story Format', width: 1080, height: 1920, description: 'Instagram/Facebook stories' },
  { id: 'facebook-cover', name: 'Facebook Cover', width: 1200, height: 630, description: 'Facebook cover photo' },
  { id: 'twitter-header', name: 'Twitter Header', width: 1500, height: 500, description: 'Twitter banner' },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, description: 'LinkedIn sharing' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, description: 'YouTube video thumbnail' },
  { id: 'profile-picture', name: 'Profile Picture', width: 400, height: 400, description: 'Social media profiles' },
  { id: 'banner-large', name: 'Large Banner', width: 1920, height: 1080, description: 'Website headers' },
];

export const wallpaperImages = [
  { id: 'wallpaper-1', name: 'Wallpaper Image 1', url: '/Assets/Wallpaper Image/Wallpaper Image 1.png' },
  { id: 'wallpaper-2', name: 'Wallpaper Image 2', url: '/Assets/Wallpaper Image/Wallpaper Image 2.png' },
  { id: 'wallpaper-3', name: 'Wallpaper Image 3', url: '/Assets/Wallpaper Image/Wallpaper Image 3.png' },
  { id: 'wallpaper-4', name: 'Wallpaper Image 4', url: '/Assets/Wallpaper Image/Wallpaper Image 4.png' },
  { id: 'wallpaper-5', name: 'Wallpaper Image 5', url: '/Assets/Wallpaper Image/Wallpaper Image 5.png' },
  { id: 'wallpaper-6', name: 'Wallpaper Image 6', url: '/Assets/Wallpaper Image/Wallpaper Image 6.png' },
  { id: 'wallpaper-7', name: 'Wallpaper Image 7', url: '/Assets/Wallpaper Image/Wallpaper Image 7.png' },
  { id: 'wallpaper-8', name: 'Wallpaper Image 8', url: '/Assets/Wallpaper Image/Wallpaper Image 8.png' },
];

interface ImageResizerProps {
  originalImage: string;
  selectedCategory: string;
  originalFile: File;
}

export default function ImageResizer({ originalImage, selectedCategory, originalFile }: ImageResizerProps) {
  const [selectedSize, setSelectedSize] = useState<ResizeOption | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);
  const [compositeImage, setCompositeImage] = useState<string | null>(null);
  const [useWallpaper, setUseWallpaper] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createWallpaperComposite = (wallpaperUrl: string) => {
    setIsProcessing(true);
    setResizedImage(null); // Clear regular resize when doing wallpaper
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const wallpaperImg = new Image();
    wallpaperImg.crossOrigin = 'anonymous';
    
    wallpaperImg.onload = () => {
      // Set canvas to wallpaper size (1920x1080)
      canvas.width = 1920;
      canvas.height = 1080;
      
      // Draw wallpaper background
      ctx.drawImage(wallpaperImg, 0, 0, 1920, 1080);
      
      // Now load and draw user image on top
      const userImg = new Image();
      userImg.onload = () => {
        // Calculate scaling to fit user image nicely on wallpaper  
        const maxSize = Math.min(1200, 900); // Max size for user image (increased from 800x600)
        const scale = Math.min(maxSize / userImg.width, maxSize / userImg.height);
        const scaledWidth = userImg.width * scale;
        const scaledHeight = userImg.height * scale;
        
        // Center the user image on the wallpaper
        const x = (1920 - scaledWidth) / 2;
        const y = (1080 - scaledHeight) / 2;
        
        // Save canvas state
        ctx.save();
        
        // Add shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;
        
        // Create rounded rectangle path for clipping
        const radius = 20; // Corner radius
        ctx.beginPath();
        ctx.roundRect(x, y, scaledWidth, scaledHeight, radius);
        ctx.clip();
        
        // Draw the user image centered on wallpaper (will be clipped to rounded corners)
        ctx.drawImage(userImg, x, y, scaledWidth, scaledHeight);
        
        // Restore canvas state to remove clipping and shadow
        ctx.restore();
        
        // Add a subtle border/frame
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, scaledWidth, scaledHeight, radius);
        ctx.stroke();
        
        const compositeDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCompositeImage(compositeDataUrl);
        setIsProcessing(false);
      };
      
      userImg.src = originalImage;
    };
    
    wallpaperImg.src = wallpaperUrl;
  };

  const resizeImage = (option: ResizeOption) => {
    setIsProcessing(true);
    setSelectedSize(option);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = option.width;
      canvas.height = option.height;
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(option.width / img.width, option.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the image
      const x = (option.width - scaledWidth) / 2;
      const y = (option.height - scaledHeight) / 2;
      
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, option.width, option.height);
      
      // Draw the resized image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setResizedImage(resizedDataUrl);
      setCompositeImage(null); // Clear composite when doing regular resize
      setIsProcessing(false);
    };
    
    img.src = originalImage;
  };

  const downloadImage = () => {
    const imageToDownload = compositeImage || resizedImage;
    if (!imageToDownload) return;
    
    const link = document.createElement('a');
    let filename;
    
    if (compositeImage) {
      filename = `${selectedCategory}-wallpaper-${originalFile.name.split('.')[0]}.jpg`;
    } else if (selectedSize) {
      filename = `${selectedCategory}-${selectedSize.id}-${originalFile.name.split('.')[0]}.jpg`;
    } else {
      filename = `${originalFile.name.split('.')[0]}-processed.jpg`;
    }
    
    link.download = filename;
    link.href = imageToDownload;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Resize Your Image</h2>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Mode Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Choose Mode</h3>
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setUseWallpaper(false)}
              className={`w-full p-3 rounded-lg border transition-all ${
                !useWallpaper
                  ? 'border-teal-400 bg-gray-800 text-white'
                  : 'border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              📏 Resize Only
            </button>
            <button
              onClick={() => setUseWallpaper(true)}
              className={`w-full p-3 rounded-lg border transition-all ${
                useWallpaper
                  ? 'border-teal-400 bg-gray-800 text-white'
                  : 'border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              🖼️ Add to Wallpaper
            </button>
          </div>

          {/* Size Options (for resize mode) */}
          {!useWallpaper && (
            <div>
              <h4 className="text-md font-semibold mb-3 text-white">Choose Size</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {resizeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => resizeImage(option)}
                    disabled={isProcessing}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all text-sm
                      ${selectedSize?.id === option.id
                        ? 'border-teal-400 bg-gray-800 shadow-lg shadow-teal-400/20'
                        : 'border-gray-600 hover:border-teal-500 bg-gray-900 hover:bg-gray-800'
                      }
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                    `}
                  >
                    <div className="font-medium text-white">{option.name}</div>
                    <div className="text-xs text-gray-300">
                      {option.width} × {option.height}px
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wallpaper Options */}
          {useWallpaper && (
            <div>
              <h4 className="text-md font-semibold mb-3 text-white">Choose Wallpaper</h4>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {wallpaperImages.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => {
                      setSelectedWallpaper(wallpaper.url);
                      createWallpaperComposite(wallpaper.url);
                    }}
                    disabled={isProcessing}
                    className={`
                      aspect-video rounded-lg border-2 overflow-hidden transition-all
                      ${selectedWallpaper === wallpaper.url
                        ? 'border-teal-400 shadow-lg shadow-teal-400/20'
                        : 'border-gray-600 hover:border-teal-500'
                      }
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Original Image */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Original Image</h3>
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
            <img
              src={originalImage}
              alt="Original"
              className="w-full max-h-64 object-contain mx-auto rounded"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {useWallpaper ? 'Wallpaper Preview' : 'Resize Preview'}
            </h3>
            {(resizedImage || compositeImage) && (
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black rounded-lg transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </div>
          
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-900 min-h-[300px] flex items-center justify-center">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-gray-300">
                <RotateCw className="h-5 w-5 animate-spin" />
                {useWallpaper ? 'Creating wallpaper...' : 'Processing image...'}
              </div>
            ) : compositeImage ? (
              <div className="text-center">
                <img
                  src={compositeImage}
                  alt="Wallpaper Composite"
                  className="max-w-full max-h-80 mx-auto rounded shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-300">1920 × 1080px wallpaper</p>
              </div>
            ) : resizedImage ? (
              <div className="text-center">
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="max-w-full max-h-80 mx-auto rounded shadow-sm"
                />
                {selectedSize && (
                  <p className="mt-2 text-sm text-gray-300">
                    {selectedSize.width} × {selectedSize.height}px
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">
                {useWallpaper ? 'Select a wallpaper to see preview' : 'Select a size to see preview'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}