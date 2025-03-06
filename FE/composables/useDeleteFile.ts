import { useRuntimeConfig } from "nuxt/app";


export const useDeleteFile = async (fileId: number | string): Promise<void> => {
  const config = useRuntimeConfig()
  try {
    await fetch(config.public.apiUrl + `/api/upload/files/${fileId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Xóa file lỗi:', error);
    throw error;
  }
};