export type CopyResult = "copied" | "failed";

type ClipboardLike = { writeText: (text: string) => Promise<void> };

/** Copies text; never throws. Browsers without the API, or that deny permission, get "failed". */
export async function copyText(
  text: string,
  clip: ClipboardLike | undefined = typeof navigator !== "undefined" ? navigator.clipboard : undefined,
): Promise<CopyResult> {
  if (!clip) return "failed";
  try {
    await clip.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
