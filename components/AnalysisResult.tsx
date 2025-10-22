
import React, { useState } from 'react';
import type { Analysis, HeatmapRegion } from '../types';
import { HeatmapImage } from './HeatmapImage';

interface AnalysisResultProps {
  analysis: Analysis[];
  imageUrl: string;
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);


const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  let bgColor = 'bg-green-500';
  if (score < 70) bgColor = 'bg-yellow-500';
  if (score < 40) bgColor = 'bg-orange-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
    </div>
  );
};


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, imageUrl }) => {
  const [activeHeatmap, setActiveHeatmap] = useState<HeatmapRegion | null>(null);
  
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Analysis Results</h3>
       <div className="text-center mb-6 text-gray-500 italic">
          Hover over a result to see the area of interest on the image.
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
           <div className="sticky top-8">
            <HeatmapImage 
              src={imageUrl} 
              alt="Analyzed lesion" 
              heatmapRegion={activeHeatmap} 
            />
           </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          {analysis.length > 0 ? (
            analysis.map((item, index) => (
              <div 
                key={index} 
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer"
                onMouseEnter={() => setActiveHeatmap(item.heatmap_region)}
                onMouseLeave={() => setActiveHeatmap(null)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-semibold text-blue-700">{item.condition}</h4>
                  <span className="text-lg font-bold text-gray-600">{item.confidence}%</span>
                </div>
                <ConfidenceBar score={item.confidence} />
                <div className="mt-4 flex items-start p-3 bg-blue-50 rounded-md border border-blue-200">
                    <InfoIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-1"/>
                    <p className="text-sm text-gray-700">{item.explanation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
              No potential conditions were identified with significant confidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
