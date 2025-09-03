'use client';

import { useState, useRef } from 'react';
import { Download, Grid, RotateCw } from 'lucide-react';

interface ThumbnailSize {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

const thumbnailSizes: ThumbnailSize[] = [
  { id: 'small', name: 'Small', width: 150, height: 150, description: 'Small preview' },
  { id: 'medium', name: 'Medium', width: 300, height: 300, description: 'Medium preview' },
  { id: 'large', name: 'Large', width: 500, height: 500, description: 'Large preview' },
  { id: 'custom', name: 'Custom', width: 200, height: 200, description: 'Custom size' },
];

interface ThumbnailMakerProps {
  originalImage: string;
  selectedCategory: string;
  originalFile: File;
}

export default function ThumbnailMaker({ originalImage, selectedCategory, originalFile }: ThumbnailMakerProps) {
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [customWidth, setCustomWidth] = useState(200);
  const [customHeight, setCustomHeight] = useState(200);
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleSizeSelection = (sizeId: string) => {
    const newSelection = new Set(selectedSizes);
    if (newSelection.has(sizeId)) {
      newSelection.delete(sizeId);
    } else {
      newSelection.add(sizeId);
    }
    setSelectedSizes(newSelection);
  };

  const generateThumbnail = (size: ThumbnailSize, customDimensions?: { width: number; height: number }): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx) {
        resolve('');
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const finalWidth = customDimensions?.width || size.width;
        const finalHeight = customDimensions?.height || size.height;
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        // Calculate scaling to maintain aspect ratio and cover the entire area
        const scale = Math.max(finalWidth / img.width, finalHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Center the image
        const x = (finalWidth - scaledWidth) / 2;
        const y = (finalHeight - scaledHeight) / 2;
        
        // Fill background with white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        
        // Draw the thumbnail
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailDataUrl);
      };
      
      img.src = originalImage;
    });
  };

  const generateSelectedThumbnails = async () => {
    if (selectedSizes.size === 0) return;
    
    setIsGenerating(true);
    const newThumbnails = new Map<string, string>();
    
    for (const sizeId of selectedSizes) {
      const size = thumbnailSizes.find(s => s.id === sizeId);
      if (size) {
        const customDimensions = size.id === 'custom' ? { width: customWidth, height: customHeight } : undefined;
        const thumbnail = await generateThumbnail(size, customDimensions);
        newThumbnails.set(sizeId, thumbnail);
      }
    }
    
    setThumbnails(newThumbnails);
    setIsGenerating(false);
  };

  const downloadThumbnail = (sizeId: string) => {
    const thumbnail = thumbnails.get(sizeId);
    if (!thumbnail) return;
    
    const size = thumbnailSizes.find(s => s.id === sizeId);
    if (!size) return;
    
    const link = document.createElement('a');
    const dimensions = size.id === 'custom' ? `${customWidth}x${customHeight}` : `${size.width}x${size.height}`;
    const filename = `${selectedCategory}-thumbnail-${dimensions}-${originalFile.name.split('.')[0]}.jpg`;
    link.download = filename;
    link.href = thumbnail;
    link.click();
  };

  const downloadAllThumbnails = () => {
    thumbnails.forEach((thumbnail, sizeId) => {
      setTimeout(() => downloadThumbnail(sizeId), 100);
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Create Thumbnails</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Size Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Select Thumbnail Sizes</h3>
          <div className="space-y-3 mb-6">
            {thumbnailSizes.map((size) => (
              <div key={size.id} className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 bg-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedSizes.has(size.id)}
                    onChange={() => toggleSizeSelection(size.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{size.name}</div>
                    {size.id !== 'custom' ? (
                      <>
                        <div className="text-sm text-gray-300">
                          {size.width} × {size.height}px
                        </div>
                        <div className="text-xs text-gray-400">
                          {size.description}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-300">
                        Specify custom dimensions
                      </div>
                    )}
                  </div>
                </label>
                
                {size.id === 'custom' && selectedSizes.has('custom') && (
                  <div className="ml-7 flex gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        min="50"
                        max="2000"
                        className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        min="50"
                        max="2000"
                        className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={generateSelectedThumbnails}
            disabled={selectedSizes.size === 0 || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 text-black disabled:text-gray-400 rounded-lg transition-colors font-medium"
          >
            {isGenerating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Grid className="h-4 w-4" />
                Generate Thumbnails
              </>
            )}
          </button>
        </div>

        {/* Thumbnail Preview */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Thumbnails</h3>
            {thumbnails.size > 0 && (
              <button
                onClick={downloadAllThumbnails}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <Download className="h-3 w-3" />
                Download All
              </button>
            )}
          </div>
          
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-900 min-h-[400px]">
            {thumbnails.size === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select sizes and generate thumbnails to see preview
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Array.from(thumbnails.entries()).map(([sizeId, thumbnail]) => {
                  const size = thumbnailSizes.find(s => s.id === sizeId);
                  const dimensions = size?.id === 'custom' ? `${customWidth}×${customHeight}` : `${size?.width}×${size?.height}`;
                  
                  return (
                    <div key={sizeId} className="text-center">
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${size?.name}`}
                        className="w-full max-w-32 mx-auto rounded shadow-sm border"
                      />
                      <p className="text-sm text-gray-300 mt-2">
                        {size?.name} ({dimensions}px)
                      </p>
                      <button
                        onClick={() => downloadThumbnail(sizeId)}
                        className="mt-1 px-2 py-1 text-xs bg-teal-500 hover:bg-teal-600 text-black rounded transition-colors font-medium"
                      >
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}