// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as geminiService from '../services/geminiService';
import * as fileUtils from '../utils/fileUtils';

// Mock the services
jest.mock('../services/geminiService');
const mockedAnalyzeImage = geminiService.analyzeImage as jest.Mock;
const mockedEditImage = geminiService.editImage as jest.Mock;

jest.mock('../utils/fileUtils');
const mockedFileToBase64 = fileUtils.fileToBase64 as jest.Mock;

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('App Integration Tests', () => {
  const mockFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
  const mockBase64 = 'mock-base64-string';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFileToBase64.mockResolvedValue(mockBase64);
  });

  test('full user workflow: upload, analyze, and generate', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Initial State
    expect(screen.getByText('Sube una imagen para empezar')).toBeInTheDocument();
    expect(screen.queryByText('Controles')).not.toBeInTheDocument();

    // 2. Upload Image
    const uploadButton = screen.getByText('Subir Foto');
    await user.click(uploadButton); // This doesn't trigger file input in JSDOM, so we manually fire the change event after finding the input.
    
    const fileInput = screen.getByText('Subir Foto').previousSibling as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(screen.getByAltText('Original')).toHaveAttribute('src', 'mock-url');
      expect(screen.getByText('Controles')).toBeInTheDocument();
    });

    // 3. Analyze Image
    mockedAnalyzeImage.mockResolvedValueOnce('This is a detailed analysis.');
    const analyzeButton = screen.getByText('Analizar Foto');
    await user.click(analyzeButton);

    expect(screen.getByText('Analizando...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Resultado del Análisis:')).toBeInTheDocument();
      expect(screen.getByText('This is a detailed analysis.')).toBeInTheDocument();
    });
    
    // 4. Generate Image
    mockedEditImage.mockResolvedValueOnce('generated-base64-string');
    const generateButton = screen.getByText('¡Viajar en el Tiempo!');
    const promptTextarea = screen.getByPlaceholderText('p. ej., Un busto romano de esta persona');
    await user.clear(promptTextarea);
    await user.type(promptTextarea, 'Make it pop art');
    
    await user.click(generateButton);
    
    expect(screen.getByText('Generando...')).toBeInTheDocument();
    await waitFor(() => {
        const generatedImage = screen.getByAltText('Generated');
        expect(generatedImage).toBeInTheDocument();
        expect(generatedImage).toHaveAttribute('src', 'data:image/png;base64,generated-base64-string');
    });

    // Verify services were called correctly
    expect(mockedAnalyzeImage).toHaveBeenCalledWith({
        inlineData: { data: mockBase64, mimeType: 'image/png' }
    });
    expect(mockedEditImage).toHaveBeenCalledWith({
        inlineData: { data: mockBase64, mimeType: 'image/png' }
    }, 'Make it pop art');
  });

  test('handles analysis failure', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const fileInput = screen.getByText('Subir Foto').previousSibling as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    mockedAnalyzeImage.mockRejectedValueOnce(new Error('API Down'));

    const analyzeButton = await screen.findByText('Analizar Foto');
    await user.click(analyzeButton);

    await waitFor(() => {
        expect(screen.getByText(/Error al analizar la imagen/)).toBeInTheDocument();
    });
  });

  test('handles generation failure', async () => {
    const user = userEvent.setup();
    render(<App />);

    const fileInput = screen.getByText('Subir Foto').previousSibling as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    mockedEditImage.mockRejectedValueOnce(new Error('Generation failed'));

    const generateButton = await screen.findByText('¡Viajar en el Tiempo!');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/Error al generar la imagen/)).toBeInTheDocument();
    });
  });
});