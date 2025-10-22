
import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const prompt = `
  You are an expert AI assistant specializing in dermatological image analysis. Your purpose is to analyze an image of a skin lesion and provide a list of potential classifications based on visual patterns. You are not a medical professional, and your analysis IS NOT a diagnosis.

  Analyze the provided image of a skin lesion. Identify the top 3 most likely potential skin conditions. For each potential condition, provide:
  1. The name of the condition.
  2. A confidence score as a percentage (0-100) representing the likelihood based on visual features.
  3. A brief explanation (2-3 sentences) describing the visual characteristics in the image that support this classification. Focus on features like color, shape, border, and texture.
  4. A 'heatmap_region' object specifying a bounding box { "x": number, "y": number, "width": number, "height": number } that highlights the most visually indicative area for this classification. All values should be percentages (0-100) relative to the image's dimensions.

  Your response must be in the specified JSON format. Do not provide any conditions with a confidence score below 10%.
`;

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<Analysis[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.ARRAY,
              description: 'A list of potential skin condition analyses.',
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: {
                    type: Type.STRING,
                    description: 'The name of the potential skin condition (e.g., Melanoma, Eczema).',
                  },
                  confidence: {
                    type: Type.NUMBER,
                    description: 'The confidence score (0-100) for this condition.',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'A brief explanation of the visual characteristics supporting the classification.',
                  },
                  heatmap_region: {
                    type: Type.OBJECT,
                    description: "Bounding box for the most significant region as percentages.",
                    properties: {
                      x: { type: Type.NUMBER, description: "Left edge as a percentage of image width." },
                      y: { type: Type.NUMBER, description: "Top edge as a percentage of image height." },
                      width: { type: Type.NUMBER, description: "Width as a percentage of image width." },
                      height: { type: Type.NUMBER, description: "Height as a percentage of image height." },
                    },
                    required: ['x', 'y', 'width', 'height'],
                  },
                },
                required: ['condition', 'confidence', 'explanation', 'heatmap_region'],
              },
            },
          },
          required: ['analysis'],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.analysis && Array.isArray(result.analysis)) {
      return result.analysis as Analysis[];
    } else {
      throw new Error('Invalid JSON structure in API response.');
    }
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('Failed to get analysis from the AI model.');
  }
};
