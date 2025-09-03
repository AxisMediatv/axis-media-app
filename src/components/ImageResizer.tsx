'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, RotateCw } from 'lucide-react';

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

interface ImageResizerProps {
  originalImage: string;
  selectedCategory: string;
  originalFile: File;
}

export default function ImageResizer({ originalImage, selectedCategory, originalFile }: ImageResizerProps) {
  const [selectedSize, setSelectedSize] = useState<ResizeOption | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setIsProcessing(false);
    };
    
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!resizedImage || !selectedSize) return;
    
    const link = document.createElement('a');
    const filename = `${selectedCategory}-${selectedSize.id}-${originalFile.name.split('.')[0]}.jpg`;
    link.download = filename;
    link.href = resizedImage;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Resize Your Image</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Size Options */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Choose Size</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {resizeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => resizeImage(option)}
                disabled={isProcessing}
                className={`
                  w-full text-left p-4 rounded-lg border transition-all
                  ${selectedSize?.id === option.id
                    ? 'border-teal-400 bg-gray-800 shadow-lg shadow-teal-400/20'
                    : 'border-gray-600 hover:border-teal-500 bg-gray-900 hover:bg-gray-800'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                `}
              >
                <div className="font-medium text-white">{option.name}</div>
                <div className="text-sm text-gray-300">
                  {option.width} × {option.height}px
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            {resizedImage && (
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
                Processing image...
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
              <p className="text-gray-400">Select a size to see preview</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}