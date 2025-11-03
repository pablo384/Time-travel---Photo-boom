// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Header';

describe('Header', () => {
  test('renders the title correctly', () => {
    render(<Header />);
    const titleElement = screen.getByRole('heading', {
      name: /Viaje en el Tiempo Cabina de Fotos/i,
    });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the camera icon', () => {
    render(<Header />);
    // The SVG has no accessible name, so we check for its presence in the header
    const header = screen.getByRole('banner');
    expect(header.querySelector('svg')).toBeInTheDocument();
  });
});