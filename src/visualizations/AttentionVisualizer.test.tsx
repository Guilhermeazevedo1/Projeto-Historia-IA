import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AttentionVisualizer } from "./Visualizations";

describe("attention visualizer", () => {
  it("unlocks coherent token selection after the guided explanation", () => {
    render(<AttentionVisualizer reducedMotion />);

    const nextButton = screen.getByRole("button", { name: /próximo passo/i });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(screen.getByRole("button", { name: /explorar livremente/i }));

    fireEvent.click(screen.getByRole("button", { name: /perseguiu:/i }));

    expect(screen.getByText("“perseguiu” agora é a Query.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cachorro: 34 por cento/i })).toBeEnabled();
  });
});
