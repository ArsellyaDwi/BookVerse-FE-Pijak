const BASE_STORAGE_URL = "https://panel-bookverse.kendah.my.id/storage";

export function buildStorageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) return url;

  if (url.includes('/storage')) {
    return `https://panel-bookverse.kendah.my.id/${url}`;
  }

  const cleanUrl = url.replace(/^\/storage/, '');
  return `${BASE_STORAGE_URL}/${cleanUrl}`;
}