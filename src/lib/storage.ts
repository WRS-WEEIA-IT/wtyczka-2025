import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User } from 'firebase/auth';
import { saveFileLocally, deleteFileLocally } from './localStorage';

// Types for file upload
export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

// Get storage type from environment
const getStorageType = (): 'firebase' | 'local' => {
  return (process.env.NEXT_PUBLIC_STORAGE_TYPE as 'firebase' | 'local') || 'firebase';
};

// Allowed file types for payment confirmation
const ALLOWED_PAYMENT_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload payment confirmation file to Firebase Storage
 */
export const uploadPaymentConfirmation = async (
  file: File,
  user: User
): Promise<FileUploadResult> => {
  try {
    // Validate file type
    if (!ALLOWED_PAYMENT_FILE_TYPES.includes(file.type)) {
      throw new Error('Nieobsługiwany typ pliku. Dozwolone formaty: PDF, PNG, JPG, JPEG');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Plik jest za duży. Maksymalny rozmiar to 5MB');
    }

    const storageType = getStorageType();

    if (storageType === 'local') {
      // Use local storage
      return await saveFileLocally(file, user.uid);
    } else {
      // Use Firebase Storage (default)
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `payment-confirmation-${user.uid}-${timestamp}.${fileExtension}`;

      // Create storage reference
      const storageRef = ref(storage, `payment-confirmations/${fileName}`);

      // Upload file
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        url: downloadURL,
        fileName: fileName,
        fileSize: file.size,
        fileType: file.type
      };
    }
  } catch (error) {
    console.error('Error uploading payment confirmation:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Błąd podczas przesyłania pliku');
  }
};

/**
 * Delete payment confirmation file from storage
 */
export const deletePaymentConfirmation = async (fileName: string, userId: string): Promise<void> => {
  try {
    const storageType = getStorageType();

    if (storageType === 'local') {
      // Delete from local storage
      await deleteFileLocally(fileName, userId);
    } else {
      // Delete from Firebase Storage
      const storageRef = ref(storage, `payment-confirmations/${fileName}`);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error('Error deleting payment confirmation:', error);
    throw new Error('Błąd podczas usuwania pliku');
  }
};

/**
 * Validate file before upload
 */
export const validatePaymentFile = (file: File): string | null => {
  if (!ALLOWED_PAYMENT_FILE_TYPES.includes(file.type)) {
    return 'Nieobsługiwany typ pliku. Dozwolone formaty: PDF, PNG, JPG, JPEG';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Plik jest za duży. Maksymalny rozmiar to 5MB';
  }

  return null; // No errors
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
