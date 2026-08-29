import { describe, expect, it } from "vitest";
import { buildTemperatureText, nextTokenProbabilities } from "./temperature";

describe("temperature sampler", () => {
  it("uses more conservative text for low temperature", () => {
    expect(buildTemperatureText("baixa")).toContain("aprendeu");
  });

  it("exposes simulated next-token probabilities", () => {
    expect(nextTokenProbabilities.alta.length).toBeGreaterThan(3);
    expect(nextTokenProbabilities.media[0][1]).toBeGreaterThan(0);
  });
});
