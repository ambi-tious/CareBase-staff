'use client';

import { DocumentContentViewer } from '@/components/2_molecules/documents/document-content-viewer';
import { DocumentDetailHeader } from '@/components/2_molecules/documents/document-detail-header';
import { DocumentLocationMoveModal } from '@/components/2_molecules/documents/document-location-move-modal';
import { DocumentMetadata } from '@/components/2_molecules/documents/document-metadata';
import type React from 'react';
import { useState } from 'react';

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
    folderId?: string | null; // 書類が保存されているフォルダID
  };
  className?: string;
  onDocumentUpdate?: (updatedDocument: any) => void; // 書類更新時のコールバック
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  className,
  onDocumentUpdate,
}) => {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(document);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentDocument.title || '無題のドキュメント'}</title>
          <style>
            body {
              font-family: ${currentDocument.fontFamily || 'Arial, sans-serif'};
              font-size: ${currentDocument.fontSize || '16px'};
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
          <div class="document-title">${currentDocument.title || '無題のドキュメント'}</div>
          <div class="document-content">${currentDocument.content}</div>
          <div class="document-footer">
            書類番号: ${currentDocument.id}<br>
            作成日時: ${currentDocument.createdAt.toLocaleString()}<br>
            最終更新: ${currentDocument.updatedAt.toLocaleString()}<br>
            作成者: ${currentDocument.createdBy.name} (${currentDocument.createdBy.role})
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleMoveLocation = () => {
    setIsMoveModalOpen(true);
  };

  const handleMoveSuccess = (newFolderId: string | null) => {
    // 書類のフォルダIDを更新
    const updatedDocument = {
      ...currentDocument,
      folderId: newFolderId,
      updatedAt: new Date(), // 最終更新日時も更新
    };

    setCurrentDocument(updatedDocument);

    // 親コンポーネントに更新を通知
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDocument);
    }

    setIsMoveModalOpen(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <DocumentDetailHeader
        documentId={currentDocument.id}
        title={currentDocument.title}
        status={currentDocument.status}
        createdAt={currentDocument.createdAt}
        onPrint={handlePrint}
        folderId={currentDocument.folderId}
        onMoveLocation={handleMoveLocation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DocumentContentViewer
            content={currentDocument.content}
            fontFamily={currentDocument.fontFamily}
            fontSize={currentDocument.fontSize}
          />
        </div>

        <div className="lg:col-span-1">
          <DocumentMetadata
            documentId={currentDocument.id}
            createdAt={currentDocument.createdAt}
            updatedAt={currentDocument.updatedAt}
            createdBy={currentDocument.createdBy}
            category={currentDocument.category}
            tags={currentDocument.tags}
            folderId={currentDocument.folderId}
          />
        </div>
      </div>

      {/* 場所移動モーダル */}
      <DocumentLocationMoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        documentId={currentDocument.id}
        documentTitle={currentDocument.title}
        currentFolderId={currentDocument.folderId || null}
        onMoveSuccess={handleMoveSuccess}
      />
    </div>
  );
};
