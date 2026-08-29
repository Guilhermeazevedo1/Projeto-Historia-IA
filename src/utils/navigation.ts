export const getNextIndex = (key: string, activeIndex: number, length: number) => {
  if (["ArrowDown", "PageDown", " "].includes(key)) {
    return Math.min(length - 1, activeIndex + 1);
  }
  if (["ArrowUp", "PageUp"].includes(key)) {
    return Math.max(0, activeIndex - 1);
  }
  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return length - 1;
  }
  return activeIndex;
};
