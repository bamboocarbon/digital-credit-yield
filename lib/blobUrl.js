// Builds a deterministic URL for a fixed-pathname Vercel Blob, avoiding a
// list() call (an "Advanced Operation", tightly rate-limited on the free
// tier) just to look up a URL that @vercel/blob v2's default
// addRandomSuffix:false already makes predictable.
export function blobUrl(pathname) {
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const storeId = token.split('_')[3];
  if (!storeId) throw new Error('BLOB_READ_WRITE_TOKEN missing or malformed');
  return `https://${storeId.toLowerCase()}.private.blob.vercel-storage.com/${pathname}`;
}
