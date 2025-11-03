// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUploader } from '../../components/ImageUploader';
import userEvent from '@testing-library/user-event';

describe('ImageUploader', () => {
  test('triggers file input click when button is clicked', async () => {
    const mockOnImageUpload = jest.fn();
    const user = userEvent.setup();
    render(<ImageUploader onImageUpload={mockOnImageUpload} />);
    
    const button = screen.getByRole('button', { name: /Subir Foto/i });
    const fileInput = button.previousSibling as HTMLInputElement;
    
    const clickSpy = jest.spyOn(fileInput, 'click');
    
    await user.click(button);
    
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test('calls onImageUpload with the selected file', () => {
    const mockOnImageUpload = jest.fn();
    render(<ImageUploader onImageUpload={mockOnImageUpload} />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const fileInput = screen.getByRole('button', { name: /Subir Foto/i }).previousSibling as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(mockOnImageUpload).toHaveBeenCalledTimes(1);
    expect(mockOnImageUpload).toHaveBeenCalledWith(file);
  });

  test('does not call onImageUpload if no file is selected', () => {
    const mockOnImageUpload = jest.fn();
    render(<ImageUploader onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByRole('button', { name: /Subir Foto/i }).previousSibling as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [] },
    });

    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });
});