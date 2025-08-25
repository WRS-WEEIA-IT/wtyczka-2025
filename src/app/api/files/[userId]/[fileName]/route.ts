import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'payment-confirmations');

// Check if file exists locally
const fileExistsLocally = (userId: string, fileName: string): boolean => {
  const filePath = path.join(UPLOADS_DIR, userId, fileName);
  return fs.existsSync(filePath);
};

// Get file path for serving
const getLocalFilePath = (userId: string, fileName: string): string => {
  return path.join(UPLOADS_DIR, userId, fileName);
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; fileName: string }> }
) {
  try {
    const { userId, fileName } = await params;

    // Check if file exists
    if (!fileExistsLocally(userId, fileName)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file path
    const filePath = getLocalFilePath(userId, fileName);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Get file extension for content type
    const extension = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
