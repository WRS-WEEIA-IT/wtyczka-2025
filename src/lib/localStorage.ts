import { FileUploadResult } from './storage';

// Save file using local API endpoint
export const saveFileLocally = async (
  file: File,
  userId: string
): Promise<FileUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch('/api/upload-local', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Nie udało się zapisać pliku lokalnie');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error(error instanceof Error ? error.message : 'Nie udało się zapisać pliku lokalnie');
  }
};

// Delete file using local API endpoint
export const deleteFileLocally = async (fileName: string, userId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/upload-local?userId=${userId}&fileName=${fileName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Nie udało się usunąć pliku lokalnego');
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
    throw new Error(error instanceof Error ? error.message : 'Nie udało się usunąć pliku lokalnego');
  }
};
