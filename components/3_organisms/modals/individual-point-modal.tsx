'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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
  const [editorContent, setEditorContent] = React.useState(content);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset editor content when the category changes
  React.useEffect(() => {
    setEditorContent(content);
    setIsEditing(false);
  }, [category, content]);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(editorContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
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
              <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                modules={modules}
                className="h-[300px] mb-12"
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
}