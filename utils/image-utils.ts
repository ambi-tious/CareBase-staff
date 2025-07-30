/**
 * Image Utilities
 *
 * Utility functions for image processing and compression
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * 画像を自動圧縮する関数
 * @param file - 圧縮する画像ファイル
 * @param options - 圧縮オプション
 * @returns 圧縮された画像のBase64文字列
 */
export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    maxSizeKB = 500,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // 元の画像サイズ
        const { width: originalWidth, height: originalHeight } = img;

        // アスペクト比を保持しながらリサイズ
        let { width, height } = calculateResizeSize(
          originalWidth,
          originalHeight,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // 画像を描画
        ctx?.drawImage(img, 0, 0, width, height);

        // 品質を調整しながら圧縮
        let currentQuality = quality;
        let compressedDataUrl = '';

        const compress = () => {
          compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          
          // Base64文字列のサイズを計算（KB）
          const sizeKB = (compressedDataUrl.length * 3) / 4 / 1024;

          // 目標サイズ以下になるまで品質を下げる
          if (sizeKB > maxSizeKB && currentQuality > 0.1) {
            currentQuality -= 0.1;
            compress();
          } else {
            resolve(compressedDataUrl);
          }
        };

        compress();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * リサイズサイズを計算する関数
 */
const calculateResizeSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  // 最大幅を超える場合
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  // 最大高さを超える場合
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Base64文字列からファイルサイズを計算
 */
export const getBase64Size = (base64String: string): number => {
  // Base64のヘッダー部分を除去
  const base64Data = base64String.split(',')[1] || base64String;
  
  // Base64文字列の長さから実際のバイト数を計算
  return (base64Data.length * 3) / 4;
};

/**
 * 画像ファイルかどうかを判定
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * サポートされている画像形式かどうかを判定
 */
export const isSupportedImageFormat = (file: File): boolean => {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
  ];
  
  return supportedTypes.includes(file.type);
};