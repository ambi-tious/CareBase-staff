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
import { Search, MoreVertical, Download, Eye, Edit, Trash2, ArrowUpDown, Folder } from 'lucide-react';
import Link from 'next/link';
import type { DocumentItem } from '@/types/document';

interface FolderContentsViewProps {
  items: DocumentItem[];
  selectedItems: string[];
  onItemSelection: (itemId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export function FolderContentsView({
  items,
  selectedItems,
  onItemSelection,
  onSelectAll,
}: FolderContentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 検索フィルタリング
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // ソート
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'size':
          // サイズの数値部分を抽出して比較（フォルダの場合はサイズなし）
          if (a.type === 'folder' && b.type === 'folder') {
            comparison = 0;
          } else if (a.type === 'folder') {
            comparison = -1; // フォルダを先に
          } else if (b.type === 'folder') {
            comparison = 1; // フォルダを先に
          } else {
            const aDoc = a as any;
            const bDoc = b as any;
            const sizeA = parseFloat(aDoc.size?.split(' ')[0] || '0');
            const sizeB = parseFloat(bDoc.size?.split(' ')[0] || '0');
            comparison = sizeA - sizeB;
          }
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredItems, sortBy, sortDirection]);

  // 全選択状態の確認
  const isAllSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  
  // 部分選択状態の確認
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredItems.length;

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

  // アイテムのリンク先を取得
  const getItemLink = (item: DocumentItem) => {
    if (item.type === 'folder') {
      return `/documents/folder/${item.id}`;
    } else {
      return `/documents/view/${item.id}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* 検索とソート */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="フォルダ・ファイルを検索..."
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
              <SelectItem value="type">種類順</SelectItem>
              <SelectItem value="size">サイズ順</SelectItem>
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

      {/* アイテム一覧テーブル */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした。' : 'このフォルダは空です。'}
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
                    名前
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
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => onItemSelection(item.id, !!checked)}
                      aria-label={`${item.name}を選択`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.type === 'folder' ? (
                        <Folder className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileIcon fileType={(item as any).fileType} className="h-5 w-5" />
                      )}
                      <Link
                        href={getItemLink(item)}
                        className="hover:text-carebase-blue hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{item.updatedAt}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.type === 'folder' ? '-' : (item as any).size}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={getItemLink(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {item.type === 'folder' ? '開く' : '表示'}
                          </Link>
                        </DropdownMenuItem>
                        {item.type === 'document' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/documents/edit/${item.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                編集
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              ダウンロード
                            </DropdownMenuItem>
                          </>
                        )}
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