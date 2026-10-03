"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FileImage, FileText, Zap, CheckCircle2, ArrowRight,
  ShieldCheck, Lock, Layers, Upload, Download, Globe, Clock,
  Users, BarChart, Star, ChevronRight, Play, File, FileCode,
  Image as ImageIcon, FileType, FileVideo, FileArchive, X, Menu,
  Mail, Home, Info, HelpCircle, AlertCircle, User, Crop, Eraser,
  Maximize, FileMinus, LayoutGrid, AlertTriangle, Shield, FileText as FileTextIcon
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NextImage from 'next/image';

// ----------------------------------------------------------------------------
// DYNAMIC LIBRARY LOADING – only loaded when needed
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
      case 'jspdf': {
        const m = await import('jspdf');
        jsPDF = m.default;
        return jsPDF;
      }
      case 'mammoth': {
        const m = await import('mammoth');
        mammoth = m.default || m;
        return mammoth;
      }
      case 'html2canvas': {
        const m = await import('html2canvas');
        html2canvas = m.default || m;
        return html2canvas;
      }
      case 'pdfjs': {
        const m = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjsLib = m;
        if (typeof window !== 'undefined') {
          try {
            const w = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = w.default;
          } catch {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
          }
        }
        return pdfjsLib;
      }
      case 'docx': {
        const m = await import('docx');
        docx = m;
        return docx;
      }
      case 'jszip': {
        const m = await import('jszip');
        JSZip = m.default;
        return JSZip;
      }
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load ${libraryName}:`, error);
    return null;
  }
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT — Convertify File Converter
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
  const [libraryErrors] = useState([]);
  const fileInputRef = useRef(null);

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

  // ----- FILE UPLOAD -----
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

  // ----- IMAGE TO IMAGE -----
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
        case 'jpg': case 'jpeg': mimeType = 'image/jpeg'; quality = 0.9; break;
        case 'webp': mimeType = 'image/webp'; quality = 0.8; break;
        case 'png': mimeType = 'image/png'; break;
        case 'gif': mimeType = 'image/gif'; break;
        case 'bmp': mimeType = 'image/bmp'; break;
        case 'ico': {
          const c = document.createElement('canvas');
          c.width = 32; c.height = 32;
          c.getContext('2d').drawImage(img, 0, 0, 32, 32);
          resolve(c.toDataURL('image/x-icon'));
          return;
        }
        case 'svg': {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><image href="${canvas.toDataURL('image/png')}" width="${img.width}" height="${img.height}"/></svg>`;
          resolve('data:image/svg+xml;base64,' + btoa(encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1))));
          return;
        }
      }
      resolve(canvas.toDataURL(mimeType, quality));
    });
  };

  // ----- TO PDF -----
  const convertToPDF = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'pdf') {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
          return;
        }
        if (imageFormats.includes(ext)) {
          if (!jsPDF) await loadLibrary('jspdf');
          if (!jsPDF) throw new Error('PDF library not available');
          const img = new window.Image();
          const reader = new FileReader();
          reader.onload = (e) => {
            img.onload = async () => {
              try {
                const pdf = new jsPDF({ orientation: img.width > img.height ? 'landscape' : 'portrait', unit: 'px', format: [img.width, img.height] });
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, img.width, img.height);
                resolve(URL.createObjectURL(pdf.output('blob')));
              } catch (err) { reject(err); }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        } else if (ext === 'docx') {
          try {
            if (!mammoth) await loadLibrary('mammoth');
            if (!html2canvas) await loadLibrary('html2canvas');
            if (!jsPDF) await loadLibrary('jspdf');
            const arrayBuffer = await file.arrayBuffer();
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            tempDiv.style.cssText = 'padding:20px;width:800px;font-family:Arial,sans-serif;font-size:14px;color:#000;background:#fff';
            document.body.appendChild(tempDiv);
            const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
            document.body.removeChild(tempDiv);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (210 - imgWidth) / 2, 10, imgWidth, imgHeight);
            resolve(URL.createObjectURL(pdf.output('blob')));
          } catch {
            reject(new Error('DOCX to PDF conversion failed.'));
          }
        } else if (ext === 'txt') {
          if (!jsPDF) await loadLibrary('jspdf');
          if (!jsPDF) throw new Error('PDF library not available');
          const text = await file.text();
          const pdf = new jsPDF();
          pdf.setFontSize(12);
          const lines = pdf.splitTextToSize(text, 180);
          let y = 20;
          for (let i = 0; i < lines.length; i++) {
            if (y > 280) { pdf.addPage(); y = 20; }
            pdf.text(lines[i], 15, y);
            y += 10;
          }
          resolve(URL.createObjectURL(pdf.output('blob')));
        } else {
          try {
            const text = await file.text();
            if (!jsPDF) await loadLibrary('jspdf');
            const pdf = new jsPDF();
            pdf.setFontSize(12);
            const lines = pdf.splitTextToSize(text.substring(0, 5000), 180);
            let y = 20;
            for (let i = 0; i < lines.length; i++) {
              if (y > 280) { pdf.addPage(); y = 20; }
              pdf.text(lines[i], 15, y);
              y += 10;
            }
            resolve(URL.createObjectURL(pdf.output('blob')));
          } catch {
            reject(new Error(`Cannot convert ${ext} to PDF`));
          }
        }
      } catch (err) { reject(err); }
    });
  };

  // ----- TO TXT -----
  const convertToTXT = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      if (!pdfjsLib) await loadLibrary('pdfjs');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      const pageCount = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        fullText += tc.items.map(item => item.str).join(' ') + '\n\n';
      }
      return URL.createObjectURL(new Blob([fullText], { type: 'text/plain;charset=utf-8' }));
    }
    if (ext === 'docx') {
      if (!mammoth) await loadLibrary('mammoth');
      const { value: text } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    }
    if (ext === 'txt') return URL.createObjectURL(file);
    if (ext === 'rtf') {
      const text = await file.text();
      const plain = text.replace(/\\[^\\]*(\\|$)/g, ' ').replace(/\{[^}]*\}/g, '').replace(/\\[a-z]+\s*/g, ' ').replace(/\s+/g, ' ').trim();
      return URL.createObjectURL(new Blob([plain], { type: 'text/plain;charset=utf-8' }));
    }
    if (imageFormats.includes(ext)) throw new Error('Image to text requires OCR.');
    const text = await file.text();
    return URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  };

  // ----- TO DOCX -----
  const convertToDOCX = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'docx') return URL.createObjectURL(file);
    let text = '';
    if (ext === 'pdf') {
      if (!pdfjsLib) await loadLibrary('pdfjs');
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pageCount = Math.min(pdf.numPages, 5);
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map(item => item.str).join(' ') + '\n\n';
      }
    } else if (['txt', 'rtf', 'html', 'xml', 'csv', 'json', 'md'].includes(ext)) {
      text = await file.text();
      if (ext === 'rtf') text = text.replace(/\\[^\\]*(\\|$)/g, ' ').replace(/\{[^}]*\}/g, '').replace(/\\[a-z]+\s*/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
      throw new Error(`Cannot convert ${ext} to DOCX`);
    }
    try {
      if (!docx) await loadLibrary('docx');
      if (docx?.Document && docx?.Packer) {
        const { Document, Packer, Paragraph, TextRun } = docx;
        const doc = new Document({ sections: [{ properties: {}, children: [new Paragraph({ children: [new TextRun({ text: text.substring(0, 10000) || 'Converted', size: 24 })] })] }] });
        return URL.createObjectURL(await Packer.toBlob(doc));
      }
    } catch (e) { console.log('docx lib failed', e); }
    // Fallback with JSZip
    if (!JSZip) await loadLibrary('jszip');
    const zip = new JSZip();
    const esc = text.substring(0, 50000).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    zip.file("[Content_Types].xml", `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file("_rels/.rels", `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    const wf = zip.folder("word");
    wf.folder("_rels").file("document.xml.rels", `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
    wf.file("document.xml", `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${esc}</w:t></w:r></w:p><w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`);
    return URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
  };

  // ----- TO RTF -----
  const convertToRTF = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    let text = '';
    if (ext === 'pdf') {
      if (!pdfjsLib) await loadLibrary('pdfjs');
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pc = Math.min(pdf.numPages, 3);
      for (let i = 1; i <= pc; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map(item => item.str).join(' ') + '\\par ';
      }
    } else if (ext === 'docx') {
      if (!mammoth) await loadLibrary('mammoth');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      text = value;
    } else if (ext === 'txt') {
      text = await file.text();
    } else throw new Error(`Cannot convert ${ext} to RTF`);
    const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Calibri;}}\\fs22 ${text.replace(/\n/g, '\\\\par ').substring(0, 5000)}}`;
    return URL.createObjectURL(new Blob([rtf], { type: 'application/rtf' }));
  };

  // ----- TO HTML -----
  const convertToHTML = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    let content = '';
    if (ext === 'pdf') {
      if (!pdfjsLib) await loadLibrary('pdfjs');
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pc = Math.min(pdf.numPages, 3);
      for (let i = 1; i <= pc; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        content += tc.items.map(item => `<p>${item.str}</p>`).join('');
      }
    } else if (ext === 'docx') {
      if (!mammoth) await loadLibrary('mammoth');
      const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      content = value;
    } else if (ext === 'txt') {
      const text = await file.text();
      content = text.split('\n').map(l => `<p>${l}</p>`).join('');
    } else throw new Error(`Cannot convert ${ext} to HTML`);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Converted</title></head><body>${content}</body></html>`;
    return URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  };

  // ----- TO XML/CSV/JSON/MD -----
  const convertToOtherFormat = async (file, targetFormat) => {
    const ext = file.name.split('.').pop().toLowerCase();
    let text = '';
    if (ext === 'pdf') {
      if (!pdfjsLib) await loadLibrary('pdfjs');
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const pc = Math.min(pdf.numPages, 2);
      for (let i = 1; i <= pc; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map(item => item.str).join(' ') + '\n';
      }
    } else if (ext === 'docx') {
      if (!mammoth) await loadLibrary('mammoth');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      text = value;
    } else text = await file.text();
    let out = '', mime = 'text/plain';
    switch (targetFormat) {
      case 'xml': out = `<?xml version="1.0"?><document><content>${text.substring(0, 1000).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</content></document>`; mime = 'application/xml'; break;
      case 'csv': out = `"Content"\n"${text.substring(0, 500).replace(/"/g, '""')}"`; mime = 'text/csv'; break;
      case 'json': out = JSON.stringify({ content: text.substring(0, 1000) }, null, 2); mime = 'application/json'; break;
      case 'md': out = `# Converted Document\n\n${text.substring(0, 2000)}`; mime = 'text/markdown'; break;
      default: throw new Error(`Unsupported format: ${targetFormat}`);
    }
    return URL.createObjectURL(new Blob([out], { type: mime }));
  };

  // ----- MAIN CONVERT -----
  const convertFile = async () => {
    if (!uploadedFile) return;
    setProcessing(true);
    setLibraryLoading(true);
    setConversionError('');
    try {
      let result;
      const inputExt = fileName.split('.').pop().toLowerCase();
      if (selectedFormat === 'pdf') {
        result = await convertToPDF(uploadedFile);
        setOutputFileName(`${fileName.split('.')[0]}.pdf`);
      } else if (imageFormats.includes(selectedFormat)) {
        if (!imageFormats.includes(inputExt)) throw new Error(`Cannot convert ${inputExt} to image.`);
        const img = new window.Image();
        const reader = new FileReader();
        result = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            img.onload = async () => { try { resolve(await convertImageToImage(img, selectedFormat)); } catch (err) { reject(err); } };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(uploadedFile);
        });
        setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`);
      } else if (selectedFormat === 'txt') { result = await convertToTXT(uploadedFile); setOutputFileName(`${fileName.split('.')[0]}.txt`); }
      else if (selectedFormat === 'docx') { result = await convertToDOCX(uploadedFile); setOutputFileName(`${fileName.split('.')[0]}.docx`); }
      else if (selectedFormat === 'rtf') { result = await convertToRTF(uploadedFile); setOutputFileName(`${fileName.split('.')[0]}.rtf`); }
      else if (selectedFormat === 'html') { result = await convertToHTML(uploadedFile); setOutputFileName(`${fileName.split('.')[0]}.html`); }
      else if (['xml', 'csv', 'json', 'md'].includes(selectedFormat)) { result = await convertToOtherFormat(uploadedFile, selectedFormat); setOutputFileName(`${fileName.split('.')[0]}.${selectedFormat}`); }
      else throw new Error(`Conversion to ${selectedFormat} is not supported`);
      setProcessedFile(result);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error.message || 'Conversion failed. Please try another format.');
    } finally {
      setProcessing(false);
      setLibraryLoading(false);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setProcessedFile(null);
    setFileName('');
    setFileType('');
    setOutputFileName('');
    setConversionError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ----- DOWNLOAD -----
  const downloadFile = () => {
    if (!processedFile) return;
    const baseName = fileName ? fileName.split('.')[0] : 'converted';
    const finalName = outputFileName || `${baseName}.${selectedFormat}`;
    const link = document.createElement('a');
    link.href = processedFile;
    link.download = finalName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 100);
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

  // ----- RENDER -----
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* MOBILE HEADER */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <NextImage src="/logo.png" alt="Format Engine Logo" width={32} height={32} className="rounded-lg object-contain" priority />
          <span className="font-bold text-gray-900 text-base">Format Engine</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-gray-600" aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <NextImage src="/logo.png" alt="Format Engine Logo" width={40} height={40} className="rounded-xl object-contain" priority />
          <Link href="/" className="text-2xl font-bold tracking-tight">Format Engine</Link>
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
          <Link href="#converter" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base">
            <Zap size={16} className="sm:size-[18px]" />
            Try Converter
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
            {[
              { href: '/', label: 'Home', Icon: Home },
              { href: '/about', label: 'About', Icon: Users },
              { href: '/privacy', label: 'Privacy', Icon: Shield },
              { href: '/contact', label: 'Support', Icon: HelpCircle },
              { href: '/terms', label: 'Terms', Icon: FileTextIcon },
            ].map(({ href, label, Icon }, i, arr) => (
              <Link key={href} href={href} className={`flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline ${i !== arr.length - 1 ? 'border-b border-gray-50' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center"><Icon size={18} /></div>
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CONVERTER SECTION */}
      <motion.section id="converter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 sm:py-8 md:py-12">
        {libraryErrors.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4" role="alert">
            <div className="flex items-center gap-2 text-yellow-700 mb-1 sm:mb-2">
              <AlertTriangle size={16} className="sm:size-5" />
              <span className="font-medium text-sm sm:text-base">Library Warning</span>
            </div>
            <p className="text-xs sm:text-sm text-yellow-600">Some features may be limited. {libraryErrors.join(' ')}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="space-y-2 sm:space-y-3 text-center md:text-left">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-orange-50 text-orange-700 rounded-full font-medium text-xs sm:text-sm">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white"><Layers size={10} className="sm:size-3" /></div>
                Simple File Converter
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Convert Files to <br /><span className="text-orange-600">Any Format</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-600 text-xs sm:text-sm md:text-base">
                Convert between 10+ document formats and 9+ image formats. Everything runs in your browser.
              </motion.p>
            </div>

            {/* Converter card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-8">
              {!uploadedFile ? (
                <div className="text-center p-4 sm:p-5 md:p-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 mx-auto">
                    <Upload size={22} className="sm:size-6 md:size-8" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Upload File</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                    Images: PNG, JPG, WebP, GIF, SVG, BMP, ICO, TIFF
                    <br className="hidden sm:block" />
                    Documents: PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown, PPTX
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <Upload size={14} className="sm:size-4" />
                    Select File
                    <input ref={fileInputRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.ico,.tiff,.pdf,.docx,.txt,.rtf,.html,.xml,.csv,.json,.md,.pptx" onChange={handleFileUpload} aria-label="File upload input" />
                  </label>
                </div>
              ) : !processedFile ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {imageFormats.includes(fileName.split('.').pop().toLowerCase()) ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <NextImage src={previewURL} alt="Preview" fill sizes="(max-width: 768px) 2rem, 2.5rem" className="rounded-lg object-cover" loading="lazy" />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${fileName.endsWith('.pdf') ? 'bg-red-100 text-red-600' : fileName.endsWith('.docx') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <FileText size={14} className="sm:size-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate text-xs sm:text-sm">{fileName}</div>
                        <div className="text-xs text-gray-500 capitalize">{fileType} File • Select format</div>
                      </div>
                    </div>
                    <button onClick={removeUploadedFile} className="p-1 text-gray-500 ml-2 flex-shrink-0" aria-label="Remove file">
                      <X size={16} className="sm:size-5" />
                    </button>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="font-medium text-xs sm:text-sm">Select Output Format ({supportedFormats.length} formats available)</label>

                    {/* Mobile horizontal scroll */}
                    <div className="md:hidden">
                      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 scrollbar-hide">
                        {supportedFormats.map((format, index) => {
                          const Icon = format.icon;
                          return (
                            <motion.button key={format.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedFormat(format.id)} className={`min-w-[80px] p-2 rounded-lg border transition-all flex-shrink-0 ${selectedFormat === format.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`} aria-pressed={selectedFormat === format.id}>
                              <div className="flex items-center justify-center mb-1"><Icon size={14} /></div>
                              <div className="text-xs font-medium truncate">{format.name}</div>
                              <div className="text-[10px] text-gray-500 mt-1 line-clamp-2 h-6 overflow-hidden">{format.description}</div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desktop grid */}
                    <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
                      {supportedFormats.map((format, index) => {
                        const Icon = format.icon;
                        return (
                          <motion.button key={format.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedFormat(format.id)} className={`p-4 rounded-lg border transition-all ${selectedFormat === format.id ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`} aria-pressed={selectedFormat === format.id}>
                            <div className="flex items-center justify-center mb-2"><Icon size={20} /></div>
                            <div className="text-sm font-medium">{format.name}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{format.description}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {conversionError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3" role="alert">
                      <div className="flex items-center gap-1 sm:gap-2 text-red-700">
                        <AlertCircle size={14} className="sm:size-4" />
                        <span className="font-medium text-xs sm:text-sm">Conversion Error</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">{conversionError}</p>
                    </motion.div>
                  )}

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={convertFile} disabled={processing || libraryLoading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base">
                    {processing || libraryLoading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {libraryLoading ? "Loading" : "Converting..."}
                      </>
                    ) : (
                      <><Zap size={14} className="sm:size-5" />Convert Now</>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-green-600 flex items-center gap-1 sm:gap-2">
                      <CheckCircle2 size={16} className="sm:size-5" />
                      Converted to {selectedFormat.toUpperCase()}
                    </h3>
                    <button onClick={removeUploadedFile} className="p-1 text-gray-500" aria-label="Remove file"><X size={16} className="sm:size-5" /></button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden border border-green-200 h-32 sm:h-40 md:h-56 flex items-center justify-center p-2 sm:p-3">
                    {selectedFormat === 'pdf' ? (
                      <iframe src={processedFile} className="w-full h-full border-0 rounded-lg" title="Converted File Preview" loading="lazy" />
                    ) : imageFormats.includes(selectedFormat) ? (
                      <div className="relative w-full h-full">
                        <NextImage src={processedFile} alt="Converted Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain rounded-lg" loading="lazy" />
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                          <CheckCircle2 size={18} className="sm:size-6" />
                        </div>
                        <p className="text-gray-900 font-bold text-xs sm:text-sm">File Converted Successfully!</p>
                        <p className="text-xs text-gray-600 mt-1">Your {selectedFormat.toUpperCase()} file is ready</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadFile} type="button" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                      <Download size={14} className="sm:size-4" />Download
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={removeUploadedFile} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                      <Upload size={14} className="sm:size-4" />New File
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Feature chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: FileImage, title: '9+ Image Formats', desc: 'PNG, JPG, WebP, etc.' },
                { icon: FileText, title: '10+ Document Formats', desc: 'PDF, DOCX, TXT, etc.' },
                { icon: ShieldCheck, title: 'Runs Locally', desc: 'Files stay on your device' },
              ].map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + index * 0.1 }} whileHover={{ y: -3 }} className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-1 sm:mb-2">
                    <item.icon size={12} className="sm:size-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm mb-0.5">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Supported Conversions</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: FileImage, title: 'Image to Image', desc: 'PNG, JPG, WebP, GIF, SVG, BMP, ICO, TIFF', cls: 'bg-orange-50 border-orange-200', iconCls: 'bg-orange-100 text-orange-600' },
                  { icon: FileText, title: 'Document to Document', desc: 'PDF, DOCX, TXT, RTF, HTML, XML, JSON, CSV, MD', cls: 'bg-blue-50 border-blue-200', iconCls: 'bg-blue-100 text-blue-600' },
                  { icon: File, title: 'Image to PDF', desc: 'Convert any image file to PDF', cls: 'bg-green-50 border-green-200', iconCls: 'bg-green-100 text-green-600' },
                  { icon: FileType, title: 'Smart Format Filtering', desc: 'Only relevant formats shown', cls: 'bg-purple-50 border-purple-200', iconCls: 'bg-purple-100 text-purple-600' },
                ].map((item, index) => (
                  <div key={index} className={`p-2 sm:p-3 rounded-lg border ${item.cls}`}>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${item.iconCls}`}>
                        <item.icon size={12} className="sm:size-4" />
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
                {['Images convert to images or PDF', 'Documents convert to documents', 'PDF to DOCX now works properly', 'All files download correctly'].map((tip, index) => (
                  <li key={index} className="flex items-start gap-1 sm:gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs">{index + 1}</div>
                    <span className="text-xs sm:text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {uploadedFile && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">File Information</h3>
                <div className="space-y-1 sm:space-y-2">
                  {[
                    { label: 'File Name', value: fileName },
                    { label: 'File Type', value: fileType, capitalize: true },
                    { label: 'Available Formats', value: supportedFormats.length },
                    { label: 'Selected Output', value: selectedFormat.toUpperCase(), color: 'text-orange-600' },
                  ].map((info, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="flex justify-between items-center p-1 sm:p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-xs">{info.label}</span>
                      <span className={`font-medium truncate max-w-[100px] sm:max-w-[120px] text-xs ${info.color || ''} ${info.capitalize ? 'capitalize' : ''}`}>{info.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section id="how-it-works" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">How It Works</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm">Simple three-step process, all in your browser</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { step: '01', title: 'Upload Your File', description: 'Drag & drop or select any file from your device.', icon: <Upload size={20} className="sm:size-6" /> },
              { step: '02', title: 'Choose Format', description: 'Select your desired output format from our list.', icon: <Layers size={20} className="sm:size-6" /> },
              { step: '03', title: 'Download & Enjoy', description: 'Get your converted file instantly. No limits.', icon: <Download size={20} className="sm:size-6" /> },
            ].map((step, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} whileHover={{ y: -5 }} className="relative">
                <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 h-full shadow-sm">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-300 mb-2 sm:mb-4">{step.step}</div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white mb-3 sm:mb-4">{step.icon}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section id="features" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Why Use This Tool</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm">Simple, fast, and private file conversion</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: <ShieldCheck size={20} className="sm:size-6" />, title: 'Privacy First', description: 'Everything happens locally in your browser. Files never leave your device.', color: 'from-orange-500 to-red-600' },
              { icon: <Zap size={20} className="sm:size-6" />, title: 'Fast Conversion', description: 'Convert files in seconds with a lightweight, optimized engine.', color: 'from-blue-500 to-purple-600' },
              { icon: <Globe size={20} className="sm:size-6" />, title: 'Many Formats', description: '19+ formats supported across images and documents.', color: 'from-green-500 to-emerald-600' },
            ].map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} whileHover={{ y: -5 }} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3 sm:mb-4`}>{feature.icon}</div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-gray-100 text-gray-800 py-8 sm:py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <NextImage src="/logo.png" alt="Format Engine Logo" width={40} height={40} className="rounded-xl object-contain" loading="lazy" />
                <span className="text-lg sm:text-2xl font-bold">Format Engine</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">A simple file conversion tool built for everyday use.</p>
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
            <p className="text-gray-600 text-xs sm:text-sm">&copy; {new Date().getFullYear()} Format Engine. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-1">All conversions are processed in your browser.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}