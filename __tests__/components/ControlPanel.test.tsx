// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlPanel } from '../../components/ControlPanel';

describe('ControlPanel', () => {
  const mockSetPrompt = jest.fn();
  const mockOnAnalyze = jest.fn();
  const mockOnGenerate = jest.fn();

  const defaultProps = {
    prompt: 'initial prompt',
    setPrompt: mockSetPrompt,
    onAnalyze: mockOnAnalyze,
    onGenerate: mockOnGenerate,
    isAnalyzing: false,
    isGenerating: false,
    analysisResult: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial props', () => {
    render(<ControlPanel {...defaultProps} />);
    expect(screen.getByLabelText('Indicación para el Viaje')).toHaveValue('initial prompt');
    expect(screen.getByText('Analizar Foto')).toBeInTheDocument();
    expect(screen.getByText('¡Viajar en el Tiempo!')).toBeInTheDocument();
    expect(screen.queryByText('Resultado del Análisis:')).not.toBeInTheDocument();
  });

  test('calls setPrompt on textarea change', () => {
    render(<ControlPanel {...defaultProps} />);
    const textarea = screen.getByLabelText('Indicación para el Viaje');
    fireEvent.change(textarea, { target: { value: 'new prompt' } });
    expect(mockSetPrompt).toHaveBeenCalledWith('new prompt');
  });

  test('calls onAnalyze when analyze button is clicked', () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('Analizar Foto'));
    expect(mockOnAnalyze).toHaveBeenCalledTimes(1);
  });

  test('calls onGenerate when generate button is clicked', () => {
    render(<ControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('¡Viajar en el Tiempo!'));
    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  test('displays analysis result when provided', () => {
    render(<ControlPanel {...defaultProps} analysisResult="Analysis complete." />);
    expect(screen.getByText('Resultado del Análisis:')).toBeInTheDocument();
    expect(screen.getByText('Analysis complete.')).toBeInTheDocument();
  });

  test('shows analyzing state correctly', () => {
    render(<ControlPanel {...defaultProps} isAnalyzing={true} />);
    expect(screen.getByText('Analizando...')).toBeInTheDocument();
    expect(screen.getByText('Analizando...').closest('button')).toBeDisabled();
    expect(screen.getByText('¡Viajar en el Tiempo!').closest('button')).toBeDisabled();
    expect(screen.getByLabelText('Indicación para el Viaje')).toBeDisabled();
  });

  test('shows generating state correctly', () => {
    render(<ControlPanel {...defaultProps} isGenerating={true} />);
    expect(screen.getByText('Generando...')).toBeInTheDocument();
    expect(screen.getByText('Generando...').closest('button')).toBeDisabled();
    expect(screen.getByText('Analizar Foto').closest('button')).toBeDisabled();
  });
});