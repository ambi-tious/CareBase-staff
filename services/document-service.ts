import { apiClient } from './api-client';

export interface ApiDocument {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export class DocumentService {
  async uploadDocument(file: File): Promise<ApiDocument> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.getClient().post<ApiDocument>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDocuments(): Promise<ApiDocument[]> {
    const response = await apiClient.getClient().get<ApiDocument[]>('/api/documents');
    return response.data;
  }

  async getDocumentById(id: string): Promise<ApiDocument | null> {
    try {
      const response = await apiClient.getClient().get<ApiDocument>(`/api/documents/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClient.getClient().get(`/api/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await apiClient.getClient().delete(`/api/documents/${id}`);
  }
}

export const documentService = new DocumentService();
