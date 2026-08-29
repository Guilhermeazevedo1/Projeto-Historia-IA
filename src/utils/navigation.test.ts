import { describe, expect, it } from "vitest";
import { getNextIndex } from "./navigation";

describe("keyboard navigation", () => {
  it("moves forward and backward by presentation keys", () => {
    expect(getNextIndex("ArrowDown", 2, 5)).toBe(3);
    expect(getNextIndex(" ", 3, 5)).toBe(4);
    expect(getNextIndex("ArrowUp", 2, 5)).toBe(1);
    expect(getNextIndex("PageUp", 0, 5)).toBe(0);
  });

  it("jumps to start and end", () => {
    expect(getNextIndex("Home", 3, 6)).toBe(0);
    expect(getNextIndex("End", 3, 6)).toBe(5);
  });
});
