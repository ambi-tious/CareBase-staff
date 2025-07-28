'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MediaAttachment } from '@/types/individual-point';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaAttachment | null;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ isOpen, onClose, media }) => {
  const [zoom, setZoom] = useState(1);

  if (!media) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">{media.fileName}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span>{formatFileSize(media.fileSize)}</span>
                <span>アップロード日時: {formatDate(media.uploadedAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {media.fileType === 'image' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetZoom} className="px-3">
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                ダウンロード
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {media.fileType === 'image' ? (
              <div className="flex items-center justify-center min-h-[400px] p-4">
                <div
                  style={{ transform: `scale(${zoom})` }}
                  className="transition-transform duration-200"
                >
                  <Image
                    src={media.url}
                    alt={media.fileName}
                    width={600}
                    height={400}
                    style={{ objectFit: 'contain' }}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            ) : media.fileType === 'video' ? (
              <div className="flex items-center justify-center min-h-[400px] p-4">
                <video
                  src={media.url}
                  controls
                  className="max-w-full max-h-[400px]"
                  preload="metadata"
                >
                  お使いのブラウザは動画の再生に対応していません。
                </video>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{media.fileName}</h3>
                <p className="text-gray-500 mb-4">このファイル形式はプレビューできません。</p>
                <Button
                  onClick={handleDownload}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロードして開く
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
