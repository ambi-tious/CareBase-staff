import { z } from 'zod';

export const folderCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'フォルダ名を入力してください')
    .max(100, 'フォルダ名は100文字以内で入力してください')
    .regex(/^[^\\/:"*?<>|]+$/, 'フォルダ名に使用できない文字が含まれています'),
});

export const folderEditSchema = folderCreateSchema;

export type FolderCreateFormData = z.infer<typeof folderCreateSchema>;
export type FolderEditFormData = z.infer<typeof folderEditSchema>;
