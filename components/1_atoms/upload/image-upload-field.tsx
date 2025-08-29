'use client';

import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url?: string) => void;
  disabled?: boolean;
  accept?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  disabled = false,
  accept = 'image/*',
  placeholder = 'サムネイル画像をアップロードしてください',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // ファイルサイズチェック (2MB制限)
      if (file.size > 2 * 1024 * 1024) {
        console.error('ファイルサイズは2MB以下にしてください');
        return;
      }

      // Base64に変換 (実際のプロジェクトではS3やCloudinaryなどにアップロード)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      onChange(base64);
    } catch (error) {
      console.error('画像のアップロードに失敗しました:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
  };

  const hasImage = !!value;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* アップロード/プレビューエリア */}
      <div className="space-y-3">
        {hasImage ? (
          <div className="relative">
            <div className="aspect-square w-32 rounded-lg overflow-hidden border mx-auto">
              <img src={value} alt="薬剤サムネイル" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                変更
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-carebase-blue" />
                <span className="text-sm text-gray-600">アップロード中...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-600">{placeholder}</span>
                <span className="text-xs text-gray-400">2MB以下のJPEG/PNG</span>
              </>
            )}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>
    </div>
  );
};
