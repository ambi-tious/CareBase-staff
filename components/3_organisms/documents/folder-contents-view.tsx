'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileIcon } from '@/components/1_atoms/documents/file-icon';
import { Search, MoreVertical, Download, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  fileType: string;
}

interface FolderContentsViewProps {
  files: File[];
  selectedFiles: string[];
  onFileSelection: (fileId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export function FolderContentsView({
  files,
  selectedFiles,
  onFileSelection,
  onSelectAll,
}: FolderContentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 検索フィルタリング
  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  // ソート
  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'size':
          // サイズの数値部分を抽出して比較
          const sizeA = parseFloat(a.size.split(' ')[0]);
          const sizeB = parseFloat(b.size.split(' ')[0]);
          comparison = sizeA - sizeB;
          break;
        case 'type':
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredFiles, sortBy, sortDirection]);

  // 全選択状態の確認
  const isAllSelected = filteredFiles.length > 0 && selectedFiles.length === filteredFiles.length;
  
  // 部分選択状態の確認
  const isIndeterminate = selectedFiles.length > 0 && selectedFiles.length < filteredFiles.length;

  // ソート方向の切り替え
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // ソート列の変更
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      toggleSortDirection();
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // ソートアイコンの表示
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    
    return (
      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
    );
  };

  return (
    <div className="space-y-4">
      {/* 検索とソート */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ファイルを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">名前順</SelectItem>
              <SelectItem value="date">更新日順</SelectItem>
              <SelectItem value="size">サイズ順</SelectItem>
              <SelectItem value="type">種類順</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            aria-label={sortDirection === 'asc' ? '昇順' : '降順'}
          >
            <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ファイル一覧テーブル */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした。' : 'このフォルダにはファイルがありません。'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onCheckedChange={onSelectAll}
                    aria-label="全て選択"
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('name')}>
                  <div className="flex items-center">
                    ファイル名
                    {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('date')}>
                  <div className="flex items-center">
                    更新日
                    {renderSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSortChange('size')}>
                  <div className="flex items-center">
                    サイズ
                    {renderSortIcon('size')}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">作成者</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={(checked) => onFileSelection(file.id, !!checked)}
                      aria-label={`${file.name}を選択`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileIcon fileType={file.fileType} className="h-5 w-5" />
                      <Link
                        href={`/documents/view/${file.id}`}
                        className="hover:text-carebase-blue hover:underline"
                      >
                        {file.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{file.updatedAt}</TableCell>
                  <TableCell className="hidden md:table-cell">{file.size}</TableCell>
                  <TableCell className="hidden md:table-cell">{file.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/view/${file.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            表示
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/documents/edit/${file.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            編集
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          ダウンロード
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}