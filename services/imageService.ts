/**
 * Compresses a base64 encoded image by resizing and reducing quality.
 * @param base64 The original base64 string (without the data URL prefix).
 * @param mimeType The original mime type.
 * @param quality The quality for JPEG compression (0.0 to 1.0).
 * @param maxWidth The maximum width or height of the compressed image.
 * @returns A promise that resolves to the compressed base64 string (as JPEG).
 */
export const compressImageBase64 = (
  base64: string,
  mimeType: string,
  quality = 0.75,
  maxWidth = 512
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      const compressedBase64 = compressedDataUrl.split(',')[1];
      resolve(compressedBase64);
    };
    img.onerror = (error) => reject(error);
  });
};
