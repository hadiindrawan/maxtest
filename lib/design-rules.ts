export const RULE_NAMES = [
  "no emoji",
  "no pills or card radii",
  "no gradients, glass or glow",
  "no soft shadows",
  "only the hard offset shadow",
  "no legacy card or badge components",
] as const;

const HARD_OFFSET = /^shadow-\[\d+px_\d+px_0_var\(--color-primary(-dark)?\)\]$/;

/** Returns one entry per breach of the owner's four design rules found in a source file. */
export function violations(source: string): string[] {
  const out: string[] = [];
  const add = (rule: (typeof RULE_NAMES)[number], hits: string[]) => hits.forEach((h) => out.push(`${rule}: ${h}`));

  add("no emoji", [...source.matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0]));
  add("no pills or card radii", source.match(/rounded-(full|xl|2xl|3xl)\b/g) ?? []);
  add("no gradients, glass or glow", source.match(/bg-gradient|text-glow|glass-panel|bg-grid|backdrop-blur|drop-shadow|neon|\bblur-/g) ?? []);
  add("no soft shadows", [...(source.match(/shadow-(sm|md|lg|xl|2xl|inner)\b/g) ?? []), ...(source.match(/rgba\(/g) ?? [])]);
  add("only the hard offset shadow", (source.match(/shadow-\[[^\]]*\]/g) ?? []).filter((m) => !HARD_OFFSET.test(m)));
  add("no legacy card or badge components", source.match(/FeatureCard|CTAButton|components\/ui\/Tag/g) ?? []);
  return out;
}
