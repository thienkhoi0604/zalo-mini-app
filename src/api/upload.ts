import axiosClient from './client';

interface UploadImageResponse {
  url: string;
}

/**
 * Nén ảnh qua Canvas.
 * - Resize cạnh dài nhất về maxSize
 * - Xuất JPEG với quality cho trước
 * - Fix lỗ Zalo Mini App WebView chặn upload file lớn từ camera
 */
function compressImage(
  file: File,
  maxSize = 1280,
  quality = 0.75,
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, '.jpg'),
            { type: 'image/jpeg', lastModified: Date.now() },
          );
          resolve(compressed);
        },
        'image/jpeg',
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể đọc file ảnh'));
    };

    img.src = url;
  });
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append('file', compressed);

  const { data } = await axiosClient.post<UploadImageResponse>(
    '/upload/image',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return data.url;
}
