import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const targetFormat = formData.get('format');
    const originalName = formData.get('originalName') || 'converted';
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const originalExtension = originalName.split('.').pop().toLowerCase();
    
    // This is a mock API - In production, you'd use actual conversion libraries
    // For now, we'll return a success response with mock data
    
    const formats = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      bmp: 'image/bmp',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      rtf: 'application/rtf',
      html: 'text/html'
    };
    
    const mimeType = formats[targetFormat] || 'application/octet-stream';
    const fileName = `${originalName.split('.')[0]}.${targetFormat}`;
    
    // For demo purposes, we'll return a mock response
    // In production, implement actual conversion logic here
    
    return NextResponse.json({
      success: true,
      fileName,
      dataUrl: `data:${mimeType};base64,${Buffer.from(`Mock converted ${targetFormat} file`).toString('base64')}`,
      format: targetFormat,
      size: fileBuffer.length,
      mimeType
    });
    
  } catch (error) {
    console.error("Conversion Error:", error);
    return NextResponse.json({ 
      error: error.message || "Conversion failed",
      details: error.toString()
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};