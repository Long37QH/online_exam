import { useRuntimeConfig } from "nuxt/app";

export interface UploadedFile {
  id: number | string;
  size: number;
  url: string;
}


export const useUploadFile = async (formData: FormData): Promise<UploadedFile> => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(config.public.apiUrl + '/api/upload', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Upload file lỗi:', error);
    throw error;
  }
};
