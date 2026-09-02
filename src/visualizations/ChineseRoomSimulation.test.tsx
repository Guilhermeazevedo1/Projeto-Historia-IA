import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChineseRoomSimulation } from "./Visualizations";

describe("Chinese Room simulation", () => {
  it("reveals the philosophical contrast before returning to the opening question", async () => {
    const onReturn = vi.fn();
    render(<ChineseRoomSimulation onReturn={onReturn} />);

    const nextButton = screen.getByRole("button", { name: /ximo passo/i });
    for (let index = 0; index < 4; index += 1) {
      fireEvent.click(nextButton);
    }

    expect(await screen.findByText("SISTEMA COMPLETO")).toBeInTheDocument();
    expect(onReturn).not.toHaveBeenCalled();

    fireEvent.click(nextButton);

    expect(await screen.findByText(/processar s.mbolos/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(onReturn).toHaveBeenCalledOnce();
  });
});
