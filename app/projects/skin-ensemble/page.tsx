'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SkinEnsemblePage() {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen pt-24 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
        Skin Ensemble Project
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-sm text-center max-w-[60%]">
        Here’s a PDF presentation of the project discussing how GANs and CNNs...
      </p>

      <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2">
        <Document file="/skin-ensemble.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="my-4 shadow-md"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}