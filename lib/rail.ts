/** Which rail item is active: the first visible section in document order, else the previous one. */
export function pickActiveId(order: readonly string[], visible: ReadonlySet<string>, previous: string): string {
  for (const id of order) if (visible.has(id)) return id;
  return previous;
}
