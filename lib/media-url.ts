/** True if URL points to a common video file (Supabase paths include extension). */
export function isVideoMediaUrl(url: string): boolean {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(path);
}
