'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onImageRemove: () => void;
}

export default function ImageUpload({ onImageSelect, selectedImage, onImageRemove }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
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
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Your Image</h2>
      
      {!selectedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your image here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, GIF, WebP formats
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-gray-50">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full h-auto max-h-96 mx-auto rounded"
            />
          </div>
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}