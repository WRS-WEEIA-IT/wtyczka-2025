import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'payment-confirmations');

// Ensure uploads directory exists
const ensureUploadsDir = (userId: string) => {
  const userDir = path.join(UPLOADS_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
};

// Generate unique filename
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  return `${timestamp}-${randomString}-${baseName}${extension}`;
};

// Validate file
const validateFile = (file: File): string | null => {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return 'Nieobsługiwany typ pliku. Dozwolone formaty: PDF, PNG, JPG, JPEG';
  }

  if (file.size > maxSize) {
    return 'Plik jest za duży. Maksymalny rozmiar to 5MB';
  }

  return null;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Brak pliku lub ID użytkownika' },
        { status: 400 }
      );
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Ensure directory exists
    const userDir = ensureUploadsDir(userId);
    
    // Generate filename
    const fileName = generateFileName(file.name);
    const filePath = path.join(userDir, fileName);
    
    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Return result
    return NextResponse.json({
      url: `/api/files/${userId}/${fileName}`,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Error uploading file locally:', error);
    return NextResponse.json(
      { error: 'Błąd podczas przesyłania pliku' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fileName = searchParams.get('fileName');

    if (!userId || !fileName) {
      return NextResponse.json(
        { error: 'Brak ID użytkownika lub nazwy pliku' },
        { status: 400 }
      );
    }

    const filePath = path.join(UPLOADS_DIR, userId, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file locally:', error);
    return NextResponse.json(
      { error: 'Błąd podczas usuwania pliku' },
      { status: 500 }
    );
  }
}
