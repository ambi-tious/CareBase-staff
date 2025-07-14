'use client';

import type React from 'react';
import { ToolbarButton } from '@/components/1_atoms/editor/toolbar-button';
import { ToolbarSeparator } from '@/components/1_atoms/editor/toolbar-separator';
import { ToolbarDropdown } from '@/components/1_atoms/editor/toolbar-dropdown';
import { ColorPicker } from '@/components/1_atoms/editor/color-picker';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

interface DocumentToolbarProps {
  onFormatText: (command: string, value?: string) => void;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  disabled?: boolean;
}

const fontFamilyOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Hiragino Kaku Gothic Pro", sans-serif', label: 'ヒラギノ' },
  { value: '"Yu Gothic", sans-serif', label: '游ゴシック' },
  { value: '"MS Gothic", monospace', label: 'MS ゴシック' },
  { value: '"Meiryo", sans-serif', label: 'メイリオ' },
];

const fontSizeOptions = [
  { value: '10px', label: '10px' },
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
  { value: '36px', label: '36px' },
];

const colorOptions = [
  { value: '#000000', label: '黒', color: '#000000' },
  { value: '#FF0000', label: '赤', color: '#FF0000' },
  { value: '#0000FF', label: '青', color: '#0000FF' },
  { value: '#008000', label: '緑', color: '#008000' },
  { value: '#FFA500', label: 'オレンジ', color: '#FFA500' },
  { value: '#800080', label: '紫', color: '#800080' },
  { value: '#A52A2A', label: '茶', color: '#A52A2A' },
  { value: '#808080', label: 'グレー', color: '#808080' },
];

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  onFormatText,
  fontFamily,
  fontSize,
  textColor,
  disabled = false,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-1 p-1 border-b bg-background">
      <ToolbarButton
        icon={Undo}
        label="元に戻す"
        onClick={() => onFormatText('undo')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={Redo}
        label="やり直し"
        onClick={() => onFormatText('redo')}
        disabled={disabled}
      />
      
      <ToolbarSeparator />
      
      <ToolbarDropdown
        value={fontFamily}
        onChange={(value) => onFormatText('fontName', value)}
        options={fontFamilyOptions}
        placeholder="フォント"
        disabled={disabled}
      />
      
      <ToolbarDropdown
        value={fontSize}
        onChange={(value) => onFormatText('fontSize', value)}
        options={fontSizeOptions}
        placeholder="サイズ"
        disabled={disabled}
        className="w-[80px]"
      />
      
      <ToolbarSeparator />
      
      <ToolbarButton
        icon={Bold}
        label="太字"
        onClick={() => onFormatText('bold')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={Italic}
        label="斜体"
        onClick={() => onFormatText('italic')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={Underline}
        label="下線"
        onClick={() => onFormatText('underline')}
        disabled={disabled}
      />
      
      <ColorPicker
        value={textColor}
        onChange={(value) => onFormatText('foreColor', value)}
        options={colorOptions}
        disabled={disabled}
      />
      
      <ToolbarSeparator />
      
      <ToolbarButton
        icon={AlignLeft}
        label="左揃え"
        onClick={() => onFormatText('justifyLeft')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={AlignCenter}
        label="中央揃え"
        onClick={() => onFormatText('justifyCenter')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={AlignRight}
        label="右揃え"
        onClick={() => onFormatText('justifyRight')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={AlignJustify}
        label="両端揃え"
        onClick={() => onFormatText('justifyFull')}
        disabled={disabled}
      />
      
      <ToolbarSeparator />
      
      <ToolbarButton
        icon={List}
        label="箇条書き"
        onClick={() => onFormatText('insertUnorderedList')}
        disabled={disabled}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="番号付きリスト"
        onClick={() => onFormatText('insertOrderedList')}
        disabled={disabled}
      />
    </div>
  );
};