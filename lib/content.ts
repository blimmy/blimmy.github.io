export function visible<T extends { visible: boolean; order: number }>(
  items: T[],
): T[] {
  return items.filter((item) => item.visible).sort((a, b) => a.order - b.order);
}
