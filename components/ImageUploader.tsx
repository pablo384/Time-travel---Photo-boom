
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16h6v-6h4l-8-8-8 8h4v6zm-4 2h14v2H5z" />
  </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
      >
        <UploadIcon className="w-6 h-6"/>
        <span>Subir Foto</span>
      </button>
    </div>
  );
};