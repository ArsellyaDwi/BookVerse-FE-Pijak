const BASE_STORAGE_URL = "http://localhost:8000/storage";

export function buildStorageUrl(url) {
  const fUrl = url.replace("/storage", "");
  return BASE_STORAGE_URL + "/" + fUrl;
}
