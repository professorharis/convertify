# Convertify

> A private, browser-based file conversion tool for common image and document formats.

**Convertify** is a client-side file converter built with **Next.js**, React, and modern browser APIs. It supports a range of image and document formats while keeping the core conversion workflow on the user's device.

## Features

| Category               | Supported Formats                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Images                 | PNG, JPG, JPEG, WebP, GIF, BMP, SVG, ICO, TIFF                                             |
| Documents              | PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown, PPTX                                  |
| Image Conversion       | Image-to-image conversion across supported image formats                                   |
| Image to PDF           | Convert an image into a single-page PDF while preserving its dimensions                    |
| Document Conversion    | Convert supported document content between compatible formats                              |
| Smart Format Filtering | Shows relevant output formats according to the selected input file                         |
| Client-side Processing | Core conversion tasks are handled in the browser rather than through a file-upload backend |

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) — App Router
* **UI:** React, [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **PDF:** `jspdf`, `pdfjs-dist`
* **DOCX:** `mammoth`, `docx`, `jszip`
* **Rendering:** `html2canvas`
* **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

* Node.js 18+
* npm, Yarn, or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/professorharis/convertify.git
cd convertify
```

### 2. Install dependencies

```bash
npm install
```

Or:

```bash
yarn install
# or
pnpm install
```

### 3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

> Conversion libraries can be loaded on demand depending on the implementation, helping keep the initial application bundle smaller.

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```text
convertify/
├── app/
│   ├── page.tsx                # Home / File Converter
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── faq/page.tsx
├── public/
├── package.json
└── README.md
```

## Supported Conversion Workflows

### Image → Image

```text
PNG ↔ JPG ↔ JPEG ↔ WebP ↔ GIF ↔ BMP ↔ SVG ↔ ICO ↔ TIFF
```

Availability of a specific conversion depends on browser capabilities and the conversion path implemented by the application.

### Image → PDF

Images can be exported as single-page PDF files using their source dimensions.

### Document Conversion

Supported document formats include:

```text
PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown, PPTX
```

Not every format is directly convertible to every other format. The application filters output options based on the selected input and supported conversion paths.

### PDF → DOCX

PDF-to-DOCX conversion uses **PDF.js** to extract selectable text. Complex layouts, embedded graphics, tables, or scanned pages may not be reproduced exactly.

## Privacy

Convertify is designed around local file processing:

* Files are processed in the browser for supported conversion workflows.
* Core conversion does not require uploading the selected file to a conversion server.
* No account is required for the basic converter workflow.
* Closing the browser session clears locally handled files from the active page.

> Privacy behavior can change if external services or analytics are introduced in a future version.

## Limitations

* Image-to-text conversion requires OCR and is not part of the current workflow.
* Scanned PDFs without selectable text cannot be reliably converted into editable document content without OCR.
* Complex document layouts may be simplified during conversion.
* Large files may be limited by browser memory and device performance.
* A maximum file-size limit may be enforced by the application configuration.

## Browser Support

Modern versions are recommended:

| Browser         | Support                       |
| --------------- | ----------------------------- |
| Chrome          | Latest                        |
| Edge            | Latest                        |
| Firefox         | Latest                        |
| Safari          | 16+                           |
| Mobile browsers | iOS / Android modern browsers |

PDF and document workflows rely on browser APIs such as **Blob**, **File**, and WebAssembly-compatible runtimes where applicable.

## Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

## License

This project is intended to be released under the **MIT License**. Add the repository's `LICENSE` file before distributing the project.

## Author

**Muhammad Haris**
Computer Science Student — Khyber Pakhtunkhwa, Pakistan

* Email: [harishkm9899@gmail.com](mailto:harishkm9899@gmail.com)
* GitHub: [@professorharis](https://github.com/professorharis)

## Project Focus

Convertify was built as a practical project to explore:

* Browser-based file processing
* File and Blob APIs
* Document and image format handling
* Client-side rendering and conversion workflows
* Responsive UI development with Next.js and Tailwind CSS

<p align="center">
  Built by <strong>Muhammad Haris</strong>
</p>

