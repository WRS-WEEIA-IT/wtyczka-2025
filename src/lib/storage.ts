import { supabase } from './supabase';
import type { User } from "@supabase/supabase-js";

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

const ALLOWED_PAYMENT_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadPaymentConfirmation(
  file: File,
  user: User
): Promise<FileUploadResult> {
  try {
    if (!ALLOWED_PAYMENT_FILE_TYPES.includes(file.type)) {
      throw new Error('Nieobsługiwany typ pliku. Dozwolone formaty: PDF, PNG, JPG, JPEG');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Plik jest za duży. Maksymalny rozmiar to 5MB');
    }

    const uuid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `wplata-${uuid}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('wtyczka-wplaty-2025')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('wtyczka-wplaty-2025').getPublicUrl(fileName);
    return {
      url: data.publicUrl,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type,
    } as FileUploadResult;

  } catch (error) {
    console.error('Error uploading payment confirmation:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Błąd podczas przesyłania pliku');
  }
};

export async function deletePaymentConfirmation(fileName: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('wtyczka-wplaty-2025')
      .remove([fileName]);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting payment confirmation:', error);
    throw new Error('Błąd podczas usuwania pliku');
  }
};


export function validatePaymentFile(file: File): string | null {
  if (!ALLOWED_PAYMENT_FILE_TYPES.includes(file.type)) {
    return 'Nieobsługiwany typ pliku. Dozwolone formaty: PDF, PNG, JPG, JPEG';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Plik jest za duży. Maksymalny rozmiar to 5MB';
  }

  return null;
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
