import type React from 'react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface IndividualPointDetailProps {
  category: string;
  content?: string;
  onSave?: (content: string) => Promise<void>;
  onClose?: () => void;
}

export const IndividualPointDetail: React.FC<IndividualPointDetailProps> = ({
  category,
  content = '',
  onSave,
  onClose,
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset editor content when the category changes
  useEffect(() => {
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{category}の詳細</CardTitle>
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
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                編集
              </Button>
              {onClose && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="h-3 w-3 mr-1" />
                  閉じる
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="min-h-[200px]">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              className="h-[200px] mb-12"
            />
          </div>
        ) : (
          <div 
            className="min-h-[200px] p-4 border rounded-md"
            dangerouslySetInnerHTML={{ __html: editorContent || '<p>詳細情報がありません。</p>' }}
          />
        )}
      </CardContent>
    </Card>
  );
};