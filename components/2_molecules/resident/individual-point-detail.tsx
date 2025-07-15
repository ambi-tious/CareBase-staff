import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X, Bold, Italic, List, ListOrdered } from 'lucide-react';

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
              className="min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue"
              dangerouslySetInnerHTML={{ __html: editorContent }}
              onInput={handleContentChange}
              style={{ whiteSpace: 'pre-wrap' }}
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