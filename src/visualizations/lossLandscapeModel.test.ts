import { describe, expect, it } from "vitest";
import {
  initialLossPoint,
  lossForWeights,
  lossMinimum,
  takeGradientStep
} from "./lossLandscapeModel";

describe("loss landscape model", () => {
  it("places the minimum at zero loss", () => {
    expect(lossForWeights(lossMinimum.w1, lossMinimum.w2)).toBe(0);
  });

  it("reduces loss with the adequate learning rate", () => {
    const next = takeGradientStep(initialLossPoint, 0.75);
    expect(next.loss).toBeLessThan(initialLossPoint.loss);
  });

  it("approaches the minimum over repeated steps", () => {
    let point = initialLossPoint;
    for (let index = 0; index < 8; index += 1) {
      point = takeGradientStep(point, 0.75);
    }
    expect(point.loss).toBeLessThan(0.001);
  });
});
