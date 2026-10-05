/** Reading time from the post HTML: tags are ignored, 200 words per minute, never below one minute. */
export function readMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
