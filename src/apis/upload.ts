import axiosClient from './client';

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosClient.post<UploadImageResponse>('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data.url;
}
