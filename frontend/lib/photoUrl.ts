// Turns a Google Drive share link into a direct image URL. The file must be
// shared as "Anyone with the link" for the image to load on the page.
// Other URLs are returned unchanged.
export function toDirectImageUrl(url: string): string {
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  const openMatch = trimmed.match(/drive\.google\.com\/open\?(?:[^#]*&)?id=([^&#]+)/);
  const ucMatch = trimmed.match(/drive\.google\.com\/uc\?(?:[^#]*&)?id=([^&#]+)/);
  const id = fileMatch?.[1] ?? openMatch?.[1] ?? ucMatch?.[1];
  if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  return trimmed;
}
