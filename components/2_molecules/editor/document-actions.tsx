'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Printer, FileDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface DocumentActionsProps {
  onSave: () => Promise<boolean>;
  onPrint: () => void;
  onExport: () => Promise<boolean>;
  className?: string;
  disabled?: boolean;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  onSave,
  onPrint,
  onExport,
  className,
  disabled = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const success = await onSave();
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError('保存に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      setSaveError('エラーが発生しました。もう一度お試しください。');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const success = await onExport();
      if (!success) {
        setExportError('エクスポートに失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      setExportError('エラーが発生しました。もう一度お試しください。');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleSave}
          disabled={disabled || isSaving}
          className="bg-carebase-blue hover:bg-carebase-blue-dark"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? '保存中...' : '保存'}
        </Button>
        <Button onClick={onPrint} disabled={disabled} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          印刷
        </Button>
        <Button onClick={handleExport} disabled={disabled || isExporting} variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          {isExporting ? 'エクスポート中...' : 'PDFエクスポート'}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">文書が正常に保存されました</AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{saveError}</AlertDescription>
        </Alert>
      )}

      {exportError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{exportError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};