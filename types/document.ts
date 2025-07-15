/**
 * Document Types
 * 
 * Types for document management system
 */

export interface DocumentBase {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Folder extends DocumentBase {
  type: 'folder';
  parentId: string | null; // null は最上位フォルダを示す
  path: string[]; // フォルダパス（IDの配列）
}

export interface Document extends DocumentBase {
  type: 'document';
  size: string;
  fileType: 'pdf' | 'doc' | 'xlsx' | 'txt' | 'html';
  category: string;
  description?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
}

export type DocumentItem = Folder | Document;

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}