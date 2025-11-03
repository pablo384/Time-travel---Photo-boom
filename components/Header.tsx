
import React from 'react';

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-cyan-500/10">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <CameraIcon className="w-8 h-8 text-cyan-400"/>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            Viaje en el Tiempo <span className="text-cyan-400">Cabina de Fotos</span>
          </h1>
        </div>
      </div>
    </header>
  );
};