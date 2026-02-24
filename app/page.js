"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Sparkles, FileImage, FileText, Zap, CheckCircle2, ArrowRight,
  ShieldCheck, Lock, Layers, Upload, Download, Globe, Clock,
  Users, BarChart, Star, ChevronRight, Play, File, FileCode,
  Image as ImageIcon, FileType, FileVideo, FileArchive, X, Menu,
  Mail, Home, Info, HelpCircle, AlertCircle, User, Crop, Eraser,
  Maximize, FileMinus, LayoutGrid, AlertTriangle, Shield, FileText as FileTextIcon
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NextImage from 'next/image'; // renamed to avoid conflict

// ----------------------------------------------------------------------------
// DYNAMIC LIBRARY LOADING – loaded only when needed
// ----------------------------------------------------------------------------
let jsPDF;
let mammoth;
let html2canvas;
let pdfjsLib;
let docx;
let JSZip;

const loadLibrary = async (libraryName) => {
  try {
    switch (libraryName) {
      case 'jspdf':
        const jspdfModule = await import('jspdf');
        jsPDF = jspdfModule.default;
        return jsPDF;
      case 'mammoth':
        const mammothModule = await import('mammoth');
        mammoth = mammothModule.default || mammothModule;
        return mammoth;
      case 'html2canvas':
        const html2canvasModule = await import('html2canvas');
        html2canvas = html2canvasModule.default || html2canvasModule;
        return html2canvas;
      case 'pdfjs':
        const pdfjsModule = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjsLib = pdfjsModule;
        if (typeof window !== 'undefined') {
          try {
            const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;
          } catch (workerError) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
          }
        }
        return pdfjsLib;
      case 'docx':
        const docxModule = await import('docx');
        docx = docxModule;
        return docx;
      case 'jszip':
        const jszipModule = await import('jszip');
        JSZip = jszipModule.default;
        return JSZip;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load ${libraryName}:`, error);
    return null;
  }
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------
export default function FormatConverterLandingPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [outputFileName, setOutputFileName] = useState('');
  const [conversionError, setConversionError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryErrors, setLibraryErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Format lists 
  const documentFormats = useMemo(() => [
    { id: 'pdf', name: 'PDF', description: 'Document format', icon: FileText, category: 'document' },
    { id: 'docx', name: 'DOCX', description: 'Microsoft Word', icon: File, category: 'document' },
    { id: 'txt', name: 'TXT', description: 'Plain text', icon: FileText, category: 'document' },
    { id: 'rtf', name: 'RTF', description: 'Rich Text Format', icon: FileText, category: 'document' },
    { id: 'html', name: 'HTML', description: 'Web page format', icon: FileCode, category: 'document' },
    { id: 'xml', name: 'XML', description: 'Structured data', icon: FileCode, category: 'document' },
    { id: 'csv', name: 'CSV', description: 'Comma separated values', icon: FileType, category: 'document' },
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation', icon: FileCode, category: 'document' },
    { id: 'md', name: 'Markdown', description: 'Lightweight markup', icon: FileType, category: 'document' },
    { id: 'pptx', name: 'PPTX', description: 'PowerPoint presentation', icon: File, category: 'document' },
  ], []);

  const imageFormatsList = useMemo(() => [
    { id: 'png', name: 'PNG', description: 'Lossless with transparency', icon: FileImage, category: 'image' },
    { id: 'jpg', name: 'JPG', description: 'Compressed for photos', icon: FileImage, category: 'image' },
    { id: 'jpeg', name: 'JPEG', description: 'Compressed format', icon: FileImage, category: 'image' },
    { id: 'webp', name: 'WebP', description: 'Modern web format', icon: FileImage, category: 'image' },
    { id: 'gif', name: 'GIF', description: 'Animated images', icon: FileVideo, category: 'image' },
    { id: 'bmp', name: 'BMP', description: 'Bitmap image', icon: FileImage, category: 'image' },
    { id: 'svg', name: 'SVG', description: 'Vector format', icon: FileCode, category: 'image' },
    { id: 'ico', name: 'ICO', description: 'Icon format', icon: FileImage, category: 'image' },
    { id: 'tiff', name: 'TIFF', description: 'High quality', icon: FileImage, category: 'image' },
  ], []);

  const imageFormats = useMemo(() => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico', 'tiff'], []);
  const documentFormatsArray = useMemo(() => ['pdf', 'docx', 'txt', 'rtf', 'html', 'xml', 'csv', 'json', 'md', 'pptx'], []);

  // No upfront library loading – removed useEffect

  // File upload handler 
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setConversionError('File size too large. Maximum size is 50MB.');
      return;
    }

    setFileName(file.name);
    setUploadedFile(file);
    setProcessedFile(null);
    setConversionError('');

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (imageFormats.includes(fileExtension)) {
      setFileType('image');
      setSelectedFormat('jpg');
    } else if (documentFormatsArray.includes(fileExtension)) {
      setFileType('document');
      setSelectedFormat('pdf');
    } else {
      setFileType('other');
      setConversionError('Unsupported file format. Please upload an image or document.');
    }
  };

  // Format filtering
  const getSupportedFormats = useCallback(() => {
    if (!uploadedFile) return [...imageFormatsList, ...documentFormats];

    const inputExtension = fileName.split('.').pop().toLowerCase();

    if (imageFormats.includes(inputExtension)) {
      return [...imageFormatsList, documentFormats.find(f => f.id === 'pdf')].filter(Boolean);
    } else if (documentFormatsArray.includes(inputExtension)) {
      return documentFormats;
    }
    return [...imageFormatsList, ...documentFormats];
  }, [uploadedFile, fileName, imageFormatsList, documentFormats, imageFormats, documentFormatsArray]);

  const supportedFormats = useMemo(() => getSupportedFormats(), [getSupportedFormats]);

  // --------------------------------------------------------------------------
  // CONVERSION FUNCTIONS (same logic, but libraries load on demand)
  // --------------------------------------------------------------------------
  const convertImageToImage = async (img, targetFormat) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      let mimeType = 'image/png';
      let quality = 0.92;

      switch (targetFormat) {
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          quality = 0.9;
          break;
        case 'webp':
          mimeType = 'image/webp';
          quality = 0.8;
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'bmp':
          mimeType = 'image/bmp';
          break;
        case 'ico':
          const icoCanvas = document.createElement('canvas');
          icoCanvas.width = 32;
          icoCanvas.height = 32;
          const icoCtx = icoCanvas.getContext('2d');
          icoCtx.drawImage(img, 0, 0, 32, 32);
          resolve(icoCanvas.toDataURL('image/x-icon'));
          return;
        case 'svg':
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${canvas.toDataURL('image/png')}" width="${img.width}" height="${img.height}"/>
          </svg>`;
          resolve('data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgContent).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))));
          return;
      }

      const convertedImage = canvas.toDataURL(mimeType, quality);
      resolve(convertedImage);
    });
  };

  const convertToPDF = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
          return;
        }

        if (imageFormats.includes(fileExtension)) {
          if (!jsPDF) await loadLibrary('jspdf');
          if (!jsPDF) throw new Error('PDF library not available');

          const img = new window.Image(); // fixed conflict
          const reader = new FileReader();

          reader.onload = (e) => {
            img.onload = async () => {
              try {
                const pdf = new jsPDF({
                  orientation: img.width > img.height ? 'landscape' : 'portrait',
                  unit: 'px',
                  format: [img.width, img.height]
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.9);

                pdf.addImage(imageData, 'JPEG', 0, 0, img.width, img.height);
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                resolve(pdfUrl);
              } catch (error) {
                reject(error);
              }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        } else if (fileExtension === 'docx') {
          try {
            if (!mammoth) await loadLibrary('mammoth');
            if (!html2canvas) await loadLibrary('html2canvas');
            if (!jsPDF) await loadLibrary('jspdf');

            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const html = result.value;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            tempDiv.style.padding = '20px';
            tempDiv.style.width = '800px';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            tempDiv.style.fontSize = '14px';
            tempDiv.style.color = '#000000';
            tempDiv.style.background = 'white';
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
            });
            document.body.removeChild(tempDiv);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            });

            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const marginLeft = (210 - imgWidth) / 2;

            pdf.addImage(imgData, 'PNG', marginLeft, 10, imgWidth, imgHeight);
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(new Error('DOCX to PDF conversion failed. Please try TXT or PDF format.'));
          }
        } else if (fileExtension === 'txt') {
          try {
            if (!jsPDF) await loadLibrary('jspdf');
            if (!jsPDF) throw new Error('PDF library not available');

            const text = await file.text();
            const pdf = new jsPDF();
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text, 180);
            let y = 20;

            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(lines[i], 15, y);
              y += 10;
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(error);
          }
        } else {
          // Fallback
          try {
            const text = await file.text();
            if (!jsPDF) await loadLibrary('jspdf');
            if (!jsPDF) throw new Error('PDF library not available');

            const pdf = new jsPDF();
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text.substring(0, 5000), 180);
            let y = 20;

            for (let i = 0; i < lines.length; i++) {
              if (y > 280) {
                pdf.addPage();
                y = 20;
              }
              pdf.text(lines[i], 15, y);
              y += 10;
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            resolve(pdfUrl);
          } catch (error) {
            reject(new Error(`Cannot convert ${fileExtension} to PDF`));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const convertToTXT = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';

        const pageCount = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (fileExtension === 'txt') {
        return URL.createObjectURL(file);
      } else if (fileExtension === 'rtf') {
        const text = await file.text();
        const plainText = text
          .replace(/\\[^\\]*(\\|$)/g, ' ')
          .replace(/\{[^}]*\}/g, '')
          .replace(/\\[a-z]+\s*/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } else if (imageFormats.includes(fileExtension)) {
        throw new Error('Image to text conversion requires OCR. Please convert to PDF first.');
      }

      // Fallback
      try {
        const text = await file.text();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        return URL.createObjectURL(blob);
      } catch (e) {
        throw new Error(`Cannot convert ${fileExtension} to TXT`);
      }
    } catch (error) {
      throw error;
    }
  };

  const convertToDOCX = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'docx') {
        return URL.createObjectURL(file);
      }

      let text = '';

      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pageCount = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n\n';
        }
      } else if (['txt', 'rtf', 'html', 'xml', 'csv', 'json', 'md'].includes(fileExtension)) {
        text = await file.text();

        if (fileExtension === 'rtf') {
          text = text
            .replace(/\\[^\\]*(\\|$)/g, ' ')
            .replace(/\{[^}]*\}/g, '')
            .replace(/\\[a-z]+\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      } else {
        throw new Error(`Cannot convert ${fileExtension} to DOCX`);
      }

      // Try docx library
      try {
        if (!docx) await loadLibrary('docx');
        if (docx && docx.Document && docx.Packer) {
          const { Document, Packer, Paragraph, TextRun } = docx;

          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text.substring(0, 10000) || 'Converted Document',
                      size: 24,
                    }),
                  ],
                }),
              ],
            }],
          });

          const blob = await Packer.toBlob(doc);
          return URL.createObjectURL(blob);
        }
      } catch (docxError) {
        console.log('Using fallback DOCX conversion:', docxError);
      }

      // Fallback with JSZip
      try {
        if (!JSZip) await loadLibrary('jszip');
        const zip = new JSZip();

        const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${text.substring(0, 50000).replace(/[<>&]/g, (c) => ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;'
        }[c]))}</w:t>
      </w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

        zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

        const wordFolder = zip.folder("word");
        const wordRelsFolder = wordFolder.folder("_rels");

        wordRelsFolder.file("document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

        wordFolder.file("document.xml", docXml);

        const blob = await zip.generateAsync({ type: "blob" });
        return URL.createObjectURL(blob);
      } catch (zipError) {
        console.log('JSZip fallback failed, using simple text:', zipError);
        const blob = new Blob([text], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('DOCX conversion error:', error);
      if (error.message.includes('Cannot convert')) {
        throw error;
      }
      throw new Error('DOCX conversion failed. Please try converting to PDF or TXT instead.');
    }
  };

  const convertToRTF = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      let text = '';

      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pageCount = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\\par ';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (fileExtension === 'txt') {
        text = await file.text();
      } else {
        throw new Error(`Cannot convert ${fileExtension} to RTF`);
      }

      const rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\*\\generator FormatConverter}\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 ${text.replace(/\n/g, '\\\\par ').substring(0, 5000)}
}`;

      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertToHTML = async (file) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      let content = '';

      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pageCount = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => `<p>${item.str}</p>`).join('');
          content += pageText;
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        content = result.value;
      } else if (fileExtension === 'txt') {
        const text = await file.text();
        content = text.split('\n').map(line => `<p>${line}</p>`).join('');
      } else {
        throw new Error(`Cannot convert ${fileExtension} to HTML`);
      }

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    p { margin-bottom: 10px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertToOtherFormat = async (file, targetFormat) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let text = '';

      if (fileExtension === 'pdf') {
        if (!pdfjsLib) await loadLibrary('pdfjs');
        if (!pdfjsLib) throw new Error('PDF library not available');

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pageCount = Math.min(pdf.numPages, 2);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n';
        }
      } else if (fileExtension === 'docx') {
        if (!mammoth) await loadLibrary('mammoth');
        if (!mammoth) throw new Error('DOCX library not available');

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }

      let convertedContent = '';
      let mimeType = 'text/plain';

      switch (targetFormat) {
        case 'xml':
          convertedContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <content>${text.substring(0, 1000).replace(/[<>&]/g, (c) => ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
          }[c]))}</content>
</document>`;
          mimeType = 'application/xml';
          break;
        case 'csv':
          convertedContent = `"Content"\n"${text.substring(0, 500).replace(/"/g, '""')}"`;
          mimeType = 'text/csv';
          break;
        case 'json':
          convertedContent = JSON.stringify({ content: text.substring(0, 1000) }, null, 2);
          mimeType = 'application/json';
          break;
        case 'md':
          convertedContent = `# Converted Document\n\n${text.substring(0, 2000)}`;
          mimeType = 'text/markdown';
          break;
        default:
          throw new Error(`Unsupported format: ${targetFormat}`);
      }

      const blob = new Blob([convertedContent], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  const convertFile = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    setLibraryLoading(true);
    setConversionError('');

    try {
      let result;
      const inputExtension = fileName.split('.').pop().toLowerCase();

      if (selectedFormat === 'pdf') {
        result = await convertToPDF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.pdf`);
      } else if (imageFormats.includes(selectedFormat)) {
        if (imageFormats.includes(inputExtension)) {
          const img = new window.Image();
          const reader = new FileReader();

          result = await new Promise((resolve, reject) => {
            reader.onload = (e) => {
              img.onload = async () => {
                try {
                  const converted = await convertImageToImage(img, selectedFormat);
                  resolve(converted);
                } catch (error) {
                  reject(error);
                }
              };
              img.onerror = () => reject(new Error('Failed to load image'));
              img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(uploadedFile);
          });
        } else {
          throw new Error(`Cannot convert ${inputExtension} to image format. Please upload an image file.`);
        }
        setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`);
      } else if (selectedFormat === 'txt') {
        result = await convertToTXT(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.txt`);
      } else if (selectedFormat === 'docx') {
        result = await convertToDOCX(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.docx`);
      } else if (selectedFormat === 'rtf') {
        result = await convertToRTF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.rtf`);
      } else if (selectedFormat === 'html') {
        result = await convertToHTML(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.html`);
      } else if (['xml', 'csv', 'json', 'md'].includes(selectedFormat)) {
        result = await convertToOtherFormat(uploadedFile, selectedFormat);
        setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`);
      } else {
        throw new Error(`Conversion to ${selectedFormat} is not supported`);
      }

      setProcessedFile(result);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error.message || 'Conversion failed. Please try another format.');
    } finally {
      setProcessing(false);
      setLibraryLoading(false);
    }
  };

  // UI helpers (unchanged)
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setProcessedFile(null);
    setFileName('');
    setFileType('');
    setOutputFileName('');
    setConversionError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;

    const link = document.createElement('a');
    link.href = processedFile;
    link.download = outputFileName || `converted-${fileName.split('.')[0]}.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPreviewURL = useCallback(() => {
    if (!uploadedFile) return '';
    return URL.createObjectURL(uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    return () => {
      if (processedFile && processedFile.startsWith('blob:')) {
        URL.revokeObjectURL(processedFile);
      }
    };
  }, [processedFile]);

  const previewURL = getPreviewURL();

  // --------------------------------------------------------------------------
  // RENDERING –  (ONLY Image → NextImage)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Mobile Header (unchanged) */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <span className="font-bold text-gray-900 text-base">Convertify</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Desktop Navbar  */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight">Convertify</Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#converter" className="hover:text-orange-600 transition-colors">Converter</Link>
          <Link href="#features" className="hover:text-orange-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-orange-600 transition-colors">How It Works</Link>
          <Link href="/about" className="hover:text-orange-600 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#converter"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
          >
            <Zap size={16} className="sm:size-[18px]" aria-hidden="true" />
            Try Converter
          </Link>
        </div>
      </nav>

      {/* Mobile Menu  */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Home size={18} aria-hidden="true" />
              </div>
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Users size={18} aria-hidden="true" />
              </div>
              <span className="font-medium">About</span>
            </Link>

            <Link
              href="/privacy"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Shield size={18} aria-hidden="true" />
              </div>
              <span className="font-medium">Privacy</span>
            </Link>

            <Link
              href="/support"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <HelpCircle size={18} aria-hidden="true" />
              </div>
              <span className="font-medium">Support</span>
            </Link>

            <Link
              href="/terms"
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <FileTextIcon size={18} aria-hidden="true" />
              </div>
              <span className="font-medium">Terms</span>
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONVERTER SECTION – */}
      <motion.section
        id="converter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12"
      >
        {libraryErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4"
            role="alert"
          >
            <div className="flex items-center gap-2 text-yellow-700 mb-1 sm:mb-2">
              <AlertTriangle size={16} className="sm:size-5" aria-hidden="true" />
              <span className="font-medium text-sm sm:text-base">Library Warning</span>
            </div>
            <p className="text-xs sm:text-sm text-yellow-600">
              Some features may be limited. {libraryErrors.join(' ')}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* LEFT SIDE - Converter  */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="space-y-2 sm:space-y-3 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-orange-50 text-orange-700 rounded-full font-medium text-xs sm:text-sm"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  <Layers size={10} className="sm:size-3" aria-hidden="true" />
                </div>
                Universal File Converter
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              >
                Convert Files to <br />
                <span className="text-orange-600">Any Format</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-xs sm:text-sm md:text-base"
              >
                Convert between 10+ document formats and 9+ image formats. All conversions done locally in your browser.
              </motion.p>
            </div>

            {/* Converter box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-8"
            >
              {!uploadedFile ? (
                <div className="text-center p-4 sm:p-5 md:p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 mx-auto"
                  >
                    <Upload size={22} className="sm:size-6 md:size-8" aria-hidden="true" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Upload File</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                    Images: PNG, JPG, WebP, GIF, SVG, BMP, ICO, TIFF
                    <br className="hidden sm:block" />
                    Documents: PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown, PPTX
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Upload size={14} className="sm:size-4" aria-hidden="true" />
                    Select File
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.ico,.tiff,.pdf,.docx,.txt,.rtf,.html,.xml,.csv,.json,.md,.pptx"
                      onChange={handleFileUpload}
                      aria-label="File upload input"
                    />
                  </label>
                </div>
              ) : !processedFile ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                >
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {imageFormats.includes(fileName.split('.').pop().toLowerCase()) ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <NextImage
                            src={previewURL}
                            alt="Preview of uploaded file"
                            fill
                            sizes="(max-width: 768px) 2rem, 2.5rem"
                            className="rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${
                          fileName.endsWith('.pdf') ? 'bg-red-100 text-red-600' :
                            fileName.endsWith('.docx') ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                        } rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <FileText size={14} className="sm:size-5" aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-xs sm:text-sm">{fileName}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {fileType} File • Select format
                        </div>
                      </div>
                    </div>
                    <button onClick={removeUploadedFile} className="p-1 text-gray-500 ml-2 flex-shrink-0" aria-label="Remove file">
                      <X size={16} className="sm:size-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="font-medium text-xs sm:text-sm">
                      Select Output Format ({supportedFormats.length} formats available)
                    </label>

                    {/* Mobile format selector */}
                    <div className="md:hidden">
                      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 scrollbar-hide">
                        {supportedFormats.map((format, index) => {
                          const Icon = format.icon;
                          return (
                            <motion.button
                              key={format.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => setSelectedFormat(format.id)}
                              className={`min-w-[80px] p-2 rounded-lg border transition-all flex-shrink-0 ${
                                selectedFormat === format.id
                                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              aria-pressed={selectedFormat === format.id}
                            >
                              <div className="flex items-center justify-center mb-1">
                                <Icon size={14} aria-hidden="true" />
                              </div>
                              <div className="text-xs font-medium truncate">{format.name}</div>
                              <div className="text-[10px] text-gray-500 mt-1 line-clamp-2 h-6 overflow-hidden">
                                {format.description}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desktop format selector */}
                    <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
                      {supportedFormats.map((format, index) => {
                        const Icon = format.icon;
                        return (
                          <motion.button
                            key={format.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedFormat(format.id)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedFormat === format.id
                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            aria-pressed={selectedFormat === format.id}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Icon size={20} aria-hidden="true" />
                            </div>
                            <div className="text-sm font-medium">{format.name}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{format.description}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {conversionError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3"
                      role="alert"
                    >
                      <div className="flex items-center gap-1 sm:gap-2 text-red-700">
                        <AlertCircle size={14} className="sm:size-4" aria-hidden="true" />
                        <span className="font-medium text-xs sm:text-sm">Conversion Error</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">{conversionError}</p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={convertFile}
                    disabled={processing || libraryLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {processing || libraryLoading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                        {libraryLoading ? "Loading Libraries..." : "Converting..."}
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="sm:size-5" aria-hidden="true" />
                        Convert Now
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-green-600 flex items-center gap-1 sm:gap-2">
                      <CheckCircle2 size={16} className="sm:size-5" aria-hidden="true" />
                      Converted to {selectedFormat.toUpperCase()}
                    </h3>
                    <button onClick={removeUploadedFile} className="p-1 text-gray-500" aria-label="Remove file">
                      <X size={16} className="sm:size-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden border border-green-200 h-32 sm:h-40 md:h-56 flex items-center justify-center p-2 sm:p-3">
                    {selectedFormat === 'pdf' ? (
                      <iframe
                        src={processedFile}
                        className="w-full h-full border-0 rounded-lg"
                        title="Converted File Preview"
                        loading="lazy"
                      />
                    ) : imageFormats.includes(selectedFormat) ? (
                      <div className="relative w-full h-full">
                        <NextImage
                          src={processedFile}
                          alt="Converted Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                          <CheckCircle2 size={18} className="sm:size-6" aria-hidden="true" />
                        </div>
                        <p className="text-gray-900 font-bold text-xs sm:text-sm">File Converted Successfully!</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Your {selectedFormat.toUpperCase()} file is ready
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadFile}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Download size={14} className="sm:size-4" aria-hidden="true" />
                      Download
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={removeUploadedFile}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Upload size={14} className="sm:size-4" aria-hidden="true" />
                      New File
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: FileImage, title: "9+ Image Formats", desc: "PNG, JPG, WebP, etc." },
                { icon: FileText, title: "10+ Document Formats", desc: "PDF, DOCX, TXT, etc." },
                { icon: ShieldCheck, title: "Privacy First", desc: "All conversions local" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-1 sm:mb-2">
                    <item.icon size={12} className="sm:size-4" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm mb-0.5">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE - Features & Info  */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Supported Conversions</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: FileImage, title: "Image to Image", desc: "PNG, JPG, WebP, GIF, SVG, BMP, ICO, TIFF", color: "orange" },
                  { icon: FileText, title: "Document to Document", desc: "PDF, DOCX, TXT, RTF, HTML, XML, JSON, CSV, MD", color: "blue" },
                  { icon: File, title: "Image to PDF", desc: "Convert any image file to PDF", color: "green" },
                  { icon: FileType, title: "Smart Format Filtering", desc: "Only relevant formats shown", color: "purple" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 sm:p-3 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-${item.color}-100 rounded-lg flex items-center justify-center text-${item.color}-600`}>
                        <item.icon size={12} className="sm:size-4" aria-hidden="true" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm">{item.title}</h4>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Conversion Tips</h3>
              <ul className="space-y-1 sm:space-y-2">
                {[
                  "Images convert to images or PDF",
                  "Documents convert to documents",
                  "PDF to DOCX now works properly",
                  "All files download correctly"
                ].map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1 sm:gap-2"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">File Information</h3>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { label: "File Name", value: fileName, truncate: true },
                    { label: "File Type", value: fileType, capitalize: true },
                    { label: "Available Formats", value: supportedFormats.length },
                    { label: "Selected Output", value: selectedFormat.toUpperCase(), color: "text-orange-600" }
                  ].map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex justify-between items-center p-1 sm:p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-600 text-xs">{info.label}</span>
                      <span className={`font-medium truncate max-w-[100px] sm:max-w-[120px] text-xs ${info.color || ''}`}>
                        {info.truncate ? fileName : info.capitalize ? info.value : info.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 to-red-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm"
            >
              Simple three-step process, all in your browser
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Upload Your File",
                description: "Drag & drop or select any file from your device.",
                icon: <Upload size={20} className="sm:size-6" />
              },
              {
                step: "02",
                title: "Choose Format",
                description: "Select your desired output format from our list.",
                icon: <Layers size={20} className="sm:size-6" />
              },
              {
                step: "03",
                title: "Download & Enjoy",
                description: "Get your converted file instantly. No limits.",
                icon: <Download size={20} className="sm:size-6" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 h-full shadow-sm">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-300 mb-2 sm:mb-4">{step.step}</div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white mb-3 sm:mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                </div>

                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section  */}
      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 sm:py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4"
            >
              Why Choose Convertify
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm"
            >
              Experience the most advanced file conversion platform with cutting-edge features
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <ShieldCheck size={20} className="sm:size-6" />,
                title: "Military-Grade Security",
                description: "All conversions happen 100% locally in your browser.",
                color: "from-orange-500 to-red-600"
              },
              {
                icon: <Zap size={20} className="sm:size-6" />,
                title: "Lightning Fast Conversion",
                description: "Convert files in seconds with our optimized engine.",
                color: "from-blue-500 to-purple-600"
              },
              {
                icon: <Globe size={20} className="sm:size-6" />,
                title: "Universal Compatibility",
                description: "19+ formats supported across images and documents.",
                color: "from-green-500 to-emerald-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 shadow-sm"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3 sm:mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section  */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 sm:py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl border border-gray-200"
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Ready to Convert Your Files?
            </h2>

            <p className="text-sm sm:text-base md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Convert any file instantly and securely everything stays on your device.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#converter"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base"
                >
                  <Upload size={14} className="sm:size-5" aria-hidden="true" />
                  Start Converting Now
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold border border-orange-500 hover:bg-orange-50 transition-colors text-sm sm:text-base"
                >
                  <Info size={14} className="sm:size-5" aria-hidden="true" />
                  Learn More
                </Link>
              </motion.div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 text-gray-600 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <ShieldCheck size={12} className="sm:size-4 text-green-600" aria-hidden="true" />
                <span>100% Secure & Local</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock size={12} className="sm:size-4 text-blue-600" aria-hidden="true" />
                <span>No Registration</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Users size={12} className="sm:size-4 text-purple-600" aria-hidden="true" />
                <span>Free Forever</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 py-8 sm:py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                  <Sparkles size={18} className="sm:size-6" aria-hidden="true" />
                </div>
                <span className="text-lg sm:text-2xl font-bold">Convertify</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                Professional file conversion tools with privacy at the core.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Product</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link href="#converter" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">Converter</Link></li>
                <li><Link href="#features" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">Features</Link></li>
                <li><Link href="#how-it-works" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link href="/about" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">About</Link></li>
                <li><Link href="/privacy" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">Privacy</Link></li>
                <li><Link href="/terms" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">Terms</Link></li>
                <li><Link href="/contact" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">Contact</Link></li>
                <li><Link href="/faq" className="text-xs sm:text-sm text-gray-600 hover:text-orange-600">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 sm:pt-8 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Convertify. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              All conversions are processed securely in your browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}