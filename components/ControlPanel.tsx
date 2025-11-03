
import React from 'react';
import { Loader } from './Loader';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  isAnalyzing: boolean;
  isGenerating: boolean;
  analysisResult: string;
}

const AnalyzeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/></svg>
);

const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m3.4 20.5 9.2-9.2L20.5 3.4 11.3 11.3 3.4 20.5Zm9.2-2.1-7.1 7.1-2.1-2.1 7.1-7.1 2.1 2.1ZM5.5 13.4 3.4 11.3 11.3 3.4l2.1 2.1-7.9 7.9Z"/></svg>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  onAnalyze,
  onGenerate,
  isAnalyzing,
  isGenerating,
  analysisResult,
}) => {
  const isDisabled = isAnalyzing || isGenerating;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
          Indicación para el Viaje
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isDisabled}
          placeholder="p. ej., Un busto romano de esta persona"
          className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-gray-200 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
            onClick={onAnalyze}
            disabled={isDisabled}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            {isAnalyzing ? <Loader /> : <AnalyzeIcon className="w-5 h-5"/>}
            <span>{isAnalyzing ? 'Analizando...' : 'Analizar Foto'}</span>
        </button>
        <button
            onClick={onGenerate}
            disabled={isDisabled}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            {isGenerating ? <Loader /> : <GenerateIcon className="w-5 h-5"/>}
            <span>{isGenerating ? 'Generando...' : '¡Viajar en el Tiempo!'}</span>
        </button>
      </div>
      
      {analysisResult && (
        <div className="mt-6 p-4 bg-gray-700/50 border border-gray-700 rounded-lg">
          <h3 className="font-bold text-cyan-400 mb-2">Resultado del Análisis:</h3>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{analysisResult}</p>
        </div>
      )}
    </div>
  );
};