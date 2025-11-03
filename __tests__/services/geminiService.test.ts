// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { analyzeImage, editImage } from '../../services/geminiService';
import { GoogleGenAI, Modality } from '@google/genai';

// Mock the entire @google/genai library
jest.mock('@google/genai', () => {
  const mockGenerateContent = jest.fn();
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    Modality: {
        IMAGE: 'IMAGE'
    }
  };
});


const mockGenerateContent = (GoogleGenAI as jest.Mock).mock.results[0].value.models.generateContent;


const mockImagePart = {
  inlineData: { data: 'base64string', mimeType: 'image/jpeg' },
};

describe('geminiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeImage', () => {
    test('should call generateContent with correct parameters and return text', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'A description of the image.' });

      const result = await analyzeImage(mockImagePart);

      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [mockImagePart, { text: 'Describe esta imagen en detalle.' }],
        },
      });
      expect(result).toBe('A description of the image.');
    });

    test('should throw a custom error on API failure', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API error'));
      await expect(analyzeImage(mockImagePart)).rejects.toThrow(
        'Error al comunicarse con la API de Gemini para el análisis.'
      );
    });
  });

  describe('editImage', () => {
    const prompt = 'Make it vintage.';

    test('should call generateContent with correct parameters and return base64 data', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [{
          content: {
            parts: [{ inlineData: { data: 'editedBase64String', mimeType: 'image/png' } }]
          }
        }]
      });

      const result = await editImage(mockImagePart, prompt);

      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [mockImagePart, { text: prompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      expect(result).toBe('editedBase64String');
    });

    test('should throw an error if no image data is in the response', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            candidates: [{
              content: {
                parts: [{ text: 'Safety filter triggered.' }] // No inlineData
              }
            }]
          });

      await expect(editImage(mockImagePart, prompt)).rejects.toThrow(
        'No se encontraron datos de imagen en la respuesta de la API.'
      );
    });
    
    test('should throw an error if candidates array is empty or undefined', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            candidates: []
          });

      await expect(editImage(mockImagePart, prompt)).rejects.toThrow(
        'No se encontraron datos de imagen en la respuesta de la API.'
      );
    });


    test('should throw a generic error on API communication failure', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API network error'));
      
      await expect(editImage(mockImagePart, prompt)).rejects.toThrow(
        'Error al comunicarse con la API de Gemini para la generación de imágenes.'
      );
    });
  });
});