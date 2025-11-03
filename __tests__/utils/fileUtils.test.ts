// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { fileToBase64 } from '../../utils/fileUtils';

describe('fileUtils', () => {
  describe('fileToBase64', () => {
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: jest.fn() as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
      onerror: jest.fn() as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
      result: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the mock implementation before each test
        // FIX: Use `window` instead of `global` in a jsdom test environment.
        Object.defineProperty(window, 'FileReader', {
            writable: true,
            value: jest.fn().mockImplementation(() => mockFileReader),
        });
    });

    test('should convert a file to a base64 string without data URL prefix', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const promise = fileToBase64(file);

      // Simulate successful file read
      mockFileReader.result = 'data:image/jpeg;base64,dGVzdGNvbnRlbnQ=';
      if(mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {} as ProgressEvent<FileReader>);
      }

      const base64 = await promise;
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
      expect(base64).toBe('dGVzdGNvbnRlbnQ=');
    });

    test('should reject the promise on a file read error', async () => {
        const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
        const promise = fileToBase64(file);
        const errorEvent = new Error('File read failed');
  
        // Simulate file read error
        if(mockFileReader.onerror) {
            mockFileReader.onerror.call(mockFileReader as any, errorEvent as any);
        }

        await expect(promise).rejects.toBe(errorEvent);
      });
  });
});