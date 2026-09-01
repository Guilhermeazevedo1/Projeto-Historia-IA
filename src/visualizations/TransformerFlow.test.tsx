import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransformerFlow } from "./Visualizations";

describe("transformer flow", () => {
  it("builds the architecture progressively and repeats next-token generation", () => {
    render(<TransformerFlow reducedMotion />);

    const nextButton = screen.getByRole("button", { name: /próximo passo/i });
    for (let index = 0; index < 7; index += 1) {
      fireEvent.click(nextButton);
    }

    expect(screen.getByText("Uma escolha atualiza o contexto e inicia outro ciclo.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /gerar próximo token/i }));
    expect(screen.getByText("Repetir o ciclo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /repetir o ciclo/i }));
    expect(screen.getByRole("button", { name: /ciclo concluído/i })).toBeDisabled();
  });
});
