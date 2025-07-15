import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Paragraph from '@tiptap/extension-paragraph';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import type { IndividualPointDetail } from '@/mocks/care-board-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, User } from 'lucide-react';

interface IndividualPointDetailProps {
  detail: IndividualPointDetail;
}

export const IndividualPointDetailView: React.FC<IndividualPointDetailProps> = ({ detail }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Image,
      Link,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Placeholder.configure({
        placeholder: '内容がありません...',
      }),
    ],
    content: detail.content,
    editable: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-carebase-blue">{detail.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{detail.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" />
            <span>{formatDate(detail.createdAt)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <EditorContent editor={editor} className="min-h-[100px] border-0 focus:outline-none" />
        </div>
      </CardContent>
    </Card>
  );
};