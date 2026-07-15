/**
 * Normalize a store URL so "https://shop.com/" and "shop.com" map to the same key.
 */
export function normalizeStoreUrl(raw) {
  if (!raw || typeof raw !== 'string') {
    throw new Error('storeUrl is required');
  }

  let value = raw.trim().toLowerCase();
  if (!value) {
    throw new Error('storeUrl is required');
  }

  if (!/^https?:\/\//.test(value)) {
    value = `https://${value}`;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Invalid storeUrl');
  }

  const path = url.pathname.replace(/\/+$/, '') || '';
  return `${url.host}${path}`;
}

export function toDocId(normalizedUrl) {
  return Buffer.from(normalizedUrl).toString('base64url');
}
