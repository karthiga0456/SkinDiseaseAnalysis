
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Spinner } from './components/Spinner';
import { Disclaimer } from './components/Disclaimer';
import { analyzeImage } from './services/geminiService';
import type { Analysis } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  };
  
  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
      });
      
      const mimeType = imageFile.type;
      const result = await analyzeImage(base64Image, mimeType);
      
      // Sort results by confidence score in descending order
      const sortedAnalysis = result.sort((a, b) => b.confidence - a.confidence);
      setAnalysis(sortedAnalysis);

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. The model may be unable to process this specific image, or an API error occurred. Please try again with a different image.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Upload Your Skin Lesion Image</h2>
            <p className="text-gray-500 mt-2">Get an AI-powered analysis of potential skin conditions.</p>
          </div>

          <ImageUploader 
            onImageUpload={handleImageUpload} 
            imageUrl={imageUrl}
            onClear={handleClear} 
          />
          
          {imageUrl && !analysis && !isLoading && (
            <div className="text-center mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Analyze Image
              </button>
            </div>
          )}
          
          {isLoading && <Spinner />}
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
              <p className="font-semibold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}

          {analysis && <AnalysisResult analysis={analysis} imageUrl={imageUrl!} />}
          
          <Disclaimer />
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Skin Disease Analyzer. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
