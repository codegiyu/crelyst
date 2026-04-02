/**
 * Returns true if the URL is a safe Google Maps embed iframe src (https, google host, /maps/embed).
 */
export function isGoogleMapsEmbedUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  const host = parsed.hostname.toLowerCase();
  if (!host.endsWith('google.com')) return false;
  return parsed.pathname.startsWith('/maps/embed');
}
