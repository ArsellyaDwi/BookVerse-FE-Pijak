const BASE_STORAGE_URL = "http://localhost:8000/storage";

export function buildStorageUrl(url) {
    return BASE_STORAGE_URL + "/" + url;
}