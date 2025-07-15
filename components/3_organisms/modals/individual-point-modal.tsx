'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X, Bold, Italic, List, ListOrdered } from 'lucide-react';

interface IndividualPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  content?: string;
  onSave?: (content: string) => Promise<void>;
}

export const IndividualPointModal: React.FC<IndividualPointModalProps> = ({
  isOpen,
  onClose,
  category,
  content = '',
  onSave,
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Reset editor content when the category changes
  useEffect(() => {
    setEditorContent(content);
    setIsEditing(false);
  }, [category, content]);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      const htmlContent = editorRef.current?.innerHTML || editorContent;
      await onSave(htmlContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary flex items-center justify-between">
            <span>{category}の詳細</span>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3 mr-1" />
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    size="sm"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? '保存中...' : '保存'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
                >
                  編集
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {category}に関する個別ポイント情報を確認・編集できます。
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px] mt-4">
          {isEditing ? (
            <div className="min-h-[300px]">
              {/* Formatting toolbar */}
              <div className="flex items-center gap-2 p-2 border-b mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormatting('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormatting('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormatting('insertUnorderedList')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormatting('insertOrderedList')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Rich text editor */}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[300px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue"
                dangerouslySetInnerHTML={{ __html: editorContent }}
                onInput={handleContentChange}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
          ) : (
            <div 
              className="min-h-[300px] p-4 border rounded-md"
              dangerouslySetInnerHTML={{ __html: editorContent || '<p>詳細情報がありません。</p>' }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};