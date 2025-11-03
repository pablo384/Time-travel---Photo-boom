
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { analyzeImage, editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('Haz que parezca una fotografía de los años 20.');
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setAnalysisResult('');
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!originalImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult('');

    try {
      const base64Data = await fileToBase64(originalImage);
      const imagePart = {
        inlineData: { data: base64Data, mimeType: originalImage.type },
      };
      const result = await analyzeImage(imagePart);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Error al analizar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [originalImage]);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    
    try {
      const base64Data = await fileToBase64(originalImage);
      const imagePart = {
        inlineData: { data: base64Data, mimeType: originalImage.type },
      };
      const resultBase64 = await editImage(imagePart, prompt);
      if (resultBase64) {
        setGeneratedImageUrl(`data:image/png;base64,${resultBase64}`);
      } else {
        throw new Error("The API did not return an image.");
      }
    } catch (err) {
      console.error('Image generation failed:', err);
      setError('Error al generar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3 bg-gray-800/50 rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Controles</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
            {originalImage && (
              <ControlPanel
                prompt={prompt}
                setPrompt={setPrompt}
                onAnalyze={handleAnalyze}
                onGenerate={handleGenerate}
                isAnalyzing={isAnalyzing}
                isGenerating={isGenerating}
                analysisResult={analysisResult}
              />
            )}
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <ImageDisplay
              originalImageUrl={originalImageUrl}
              generatedImageUrl={generatedImageUrl}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;