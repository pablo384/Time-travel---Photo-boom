// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImageDisplay } from '../../components/ImageDisplay';

describe('ImageDisplay', () => {
  test('renders placeholders when no images are provided', () => {
    render(<ImageDisplay originalImageUrl={null} generatedImageUrl={null} isGenerating={false} />);
    expect(screen.getByText('Sube una imagen para empezar')).toBeInTheDocument();
    expect(screen.getByText('Tu resultado aparecerá aquí')).toBeInTheDocument();
    expect(screen.queryByAltText('Original')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Generated')).not.toBeInTheDocument();
  });

  test('renders original image when URL is provided', () => {
    render(<ImageDisplay originalImageUrl="original.jpg" generatedImageUrl={null} isGenerating={false} />);
    const originalImage = screen.getByAltText('Original');
    expect(originalImage).toBeInTheDocument();
    expect(originalImage).toHaveAttribute('src', 'original.jpg');
  });

  test('renders generated image when URL is provided', () => {
    render(<ImageDisplay originalImageUrl="original.jpg" generatedImageUrl="generated.png" isGenerating={false} />);
    const generatedImage = screen.getByAltText('Generated');
    expect(generatedImage).toBeInTheDocument();
    expect(generatedImage).toHaveAttribute('src', 'generated.png');
  });

  test('displays loader when generating', () => {
    render(<ImageDisplay originalImageUrl="original.jpg" generatedImageUrl={null} isGenerating={true} />);
    expect(screen.getByText('Generando tu obra maestra...')).toBeInTheDocument();
    // The placeholder should not be visible
    expect(screen.queryByText('Tu resultado aparecerá aquí')).not.toBeInTheDocument();
  });

  test('displays generated image and hides loader when generation is complete', () => {
    render(<ImageDisplay originalImageUrl="original.jpg" generatedImageUrl="generated.png" isGenerating={false} />);
    expect(screen.queryByText('Generando tu obra maestra...')).not.toBeInTheDocument();
    expect(screen.getByAltText('Generated')).toBeInTheDocument();
  });
});