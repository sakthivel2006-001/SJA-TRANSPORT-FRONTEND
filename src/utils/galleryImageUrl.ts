export const getGalleryImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return '';

  if (/^(https?:\/\/|blob:|data:)/i.test(imageUrl)) {
    return imageUrl;
  }

  const backendBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/i, '');

  if (!backendBaseUrl) {
    return imageUrl;
  }

  return `${backendBaseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};
