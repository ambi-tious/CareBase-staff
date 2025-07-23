'use client';

import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fontFamily: string;
  fontSize: string;
  className?: string;
  disabled?: boolean;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  content,
  onContentChange,
  fontFamily,
  fontSize,
  className,
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 初期コンテンツをセット
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // エディタの変更を検知してコールバックを呼び出す
  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  // フォントファミリーとフォントサイズの適用
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontFamily = fontFamily;
      editorRef.current.style.fontSize = fontSize;
    }
  }, [fontFamily, fontSize]);

  return (
    <div
      className={cn(
        'relative min-h-[300px] rounded-md border border-input bg-background',
        isFocused && 'ring-2 ring-ring',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[300px] outline-none"
        style={{ fontFamily, fontSize }}
        data-placeholder="文書の内容を入力してください..."
      />
      {!content && !isFocused && (
        <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
          文書の内容を入力してください...
        </div>
      )}
    </div>
  );
};
