'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { DocumentHeader } from '@/components/2_molecules/editor/document-header';
import { DocumentToolbar } from '@/components/2_molecules/editor/document-toolbar';
import { DocumentEditor } from '@/components/2_molecules/editor/document-editor';
import { DocumentActions } from '@/components/2_molecules/editor/document-actions';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';

interface DocumentFormProps {
  initialDocument?: {
    id?: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
  onSave?: (document: {
    title: string;
    content: string;
  }) => Promise<boolean>;
  className?: string;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  initialDocument = {
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  onSave,
  className,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialDocument.title);
  const [content, setContent] = useState(initialDocument.content);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [createdAt] = useState(initialDocument.createdAt);
  const [updatedAt, setUpdatedAt] = useState(initialDocument.updatedAt);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<Date | null>(null);

  // 変更を検知
  useEffect(() => {
    if (title !== initialDocument.title || content !== initialDocument.content) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [title, content, initialDocument.title, initialDocument.content]);

  // 自動保存
  useEffect(() => {
    if (!hasChanges || !onSave || isAutoSaving) return;

    const autoSaveTimer = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        const success = await onSave({ title, content });
        if (success) {
          setHasChanges(false);
          setUpdatedAt(new Date());
          setLastAutoSaveTime(new Date());
        }
      } catch (error) {
        console.error('Auto save error:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 5000); // 5秒後に自動保存

    return () => clearTimeout(autoSaveTimer);
  }, [hasChanges, title, content, onSave, isAutoSaving]);

  // ブラウザの戻るボタン対応
  useBeforeUnload(hasChanges, '変更が保存されていません。このページを離れますか？');

  // テキストフォーマット処理
  const handleFormatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
  }, []);

  // 保存処理
  const handleSave = async () => {
    if (!onSave) return false;
    
    try {
      const success = await onSave({ title, content });
      if (success) {
        setHasChanges(false);
        setUpdatedAt(new Date());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  // 印刷処理
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || '無題のドキュメント'}</title>
          <style>
            body {
              font-family: ${fontFamily};
              font-size: ${fontSize};
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
          <div class="document-title">${title || '無題のドキュメント'}</div>
          <div class="document-content">${content}</div>
          <div class="document-footer">
            作成日時: ${createdAt.toLocaleString()}<br>
            最終更新: ${updatedAt.toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // PDFエクスポート処理
  const handleExport = async () => {
    // 実際のPDF生成はサーバーサイドで行うか、
    // jsPDFなどのライブラリを使用する必要があります
    // ここではモックとして成功を返します
    return true;
  };

  return (
    <div className={className}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <DocumentHeader
            title={title}
            onTitleChange={setTitle}
            createdAt={createdAt}
            updatedAt={updatedAt}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <DocumentToolbar
          onFormatText={handleFormatText}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textColor={textColor}
        />
        <CardContent className="p-4">
          <DocumentEditor
            content={content}
            onContentChange={setContent}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        </CardContent>
      </Card>

      <DocumentActions
        onSave={handleSave}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      {lastAutoSaveTime && (
        <p className="text-xs text-muted-foreground mt-2">
          最終自動保存: {lastAutoSaveTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};