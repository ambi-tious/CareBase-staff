'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FileUp, Loader2, Upload, X } from 'lucide-react';
import { FileIcon } from '@/components/1_atoms/documents/file-icon';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<boolean>;
  folderId: string;
  folderName: string;
}

export function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  folderId,
  folderName,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('アップロードするファイルを選択してください');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    // アップロード進捗のシミュレーション
    const simulateProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 200);
      
      return interval;
    };
    
    const progressInterval = simulateProgress();

    try {
      const success = await onUpload(files);
      
      // 進捗シミュレーションを停止
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (success) {
        // 少し待ってからモーダルを閉じる
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        setError('ファイルのアップロードに失敗しました。もう一度お試しください。');
        setUploadProgress(0);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      setError('エラーが発生しました。もう一度お試しください。');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  const getFileTypeIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'doc';
    if (['xls', 'xlsx'].includes(extension)) return 'xlsx';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) return 'image';
    if (['html', 'htm'].includes(extension)) return 'html';
    
    return 'txt';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-carebase-blue" />
            ファイルのアップロード
          </DialogTitle>
          <DialogDescription>
            「{folderName}」フォルダにファイルをアップロードします。
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* ファイル選択エリア */}
        {files.length === 0 ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              ファイルをドラッグ＆ドロップするか、クリックして選択してください
            </p>
            <p className="text-xs text-gray-500">最大ファイルサイズ: 10MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              disabled={isUploading}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">選択されたファイル</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                すべてクリア
              </Button>
            </div>
            <div className="max-h-[200px] overflow-y-auto border rounded-md">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon fileType={getFileTypeIcon(file) as any} className="h-5 w-5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <FileUp className="h-4 w-4 mr-2" />
              さらにファイルを追加
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              disabled={isUploading}
            />
          </div>
        )}

        {/* アップロード進捗 */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>アップロード中...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                アップロード中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                アップロード
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}