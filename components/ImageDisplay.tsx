
import React from 'react';
import { Loader } from './Loader';

interface ImageDisplayProps {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  isGenerating: boolean;
}

const ImagePlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="w-full aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-700">
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <p className="text-sm text-gray-600">
            {title === "Foto Original" ? "Sube una imagen para empezar" : "Tu resultado aparecerá aquí"}
        </p>
    </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImageUrl,
  generatedImageUrl,
  isGenerating,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-400">Foto Original</h2>
        {originalImageUrl ? (
            <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain" />
            </div>
        ) : <ImagePlaceholder title="Foto Original" />}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">Foto Generada</h2>
        <div className="relative w-full aspect-square">
            {isGenerating && (
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10">
                    <Loader />
                    <p className="mt-4 text-lg">Generando tu obra maestra...</p>
                </div>
            )}
            {generatedImageUrl ? (
                 <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-cyan-500">
                    <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-contain" />
                 </div>
            ) : !isGenerating && <ImagePlaceholder title="Foto Generada" />}
        </div>
      </div>
    </div>
  );
};