'use client';

import type React from 'react';
import { DocumentDetailHeader } from '@/components/2_molecules/documents/document-detail-header';
import { DocumentContentViewer } from '@/components/2_molecules/documents/document-content-viewer';
import { DocumentMetadata } from '@/components/2_molecules/documents/document-metadata';

interface DocumentDetailProps {
  document: {
    id: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
      id: string;
      name: string;
      role: string;
    };
    category: string;
    tags?: string[];
    fontFamily?: string;
    fontSize?: string;
  };
  className?: string;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ document, className }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${document.title || '無題のドキュメント'}</title>
          <style>
            body {
              font-family: ${document.fontFamily || 'Arial, sans-serif'};
              font-size: ${document.fontSize || '16px'};
              padding: 20px;
            }
            .document-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .document-content {
              margin-bottom: 20px;
            }
            .document-footer {
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="document-title">${document.title || '無題のドキュメント'}</div>
          <div class="document-content">${document.content}</div>
          <div class="document-footer">
            書類番号: ${document.id}<br>
            作成日時: ${document.createdAt.toLocaleString()}<br>
            最終更新: ${document.updatedAt.toLocaleString()}<br>
            作成者: ${document.createdBy.name} (${document.createdBy.role})
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <DocumentDetailHeader
        documentId={document.id}
        title={document.title}
        status={document.status}
        createdAt={document.createdAt}
        onPrint={handlePrint}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DocumentContentViewer
            content={document.content}
            fontFamily={document.fontFamily}
            fontSize={document.fontSize}
          />
        </div>
        
        <div className="lg:col-span-1">
          <DocumentMetadata
            documentId={document.id}
            createdAt={document.createdAt}
            updatedAt={document.updatedAt}
            createdBy={document.createdBy}
            category={document.category}
            tags={document.tags}
          />
        </div>
      </div>
    </div>
  );
};