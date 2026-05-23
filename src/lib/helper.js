const BASE_STORAGE_URL = "http://localhost:8000/storage";

export function buildStorageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) return url;

  if (url.includes('/storage')) {
    return `http://localhost:8000${url}`;
  }

  const cleanUrl = url.replace(/^\/storage/, '');
  return `${BASE_STORAGE_URL}/${cleanUrl}`;
}