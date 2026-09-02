import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorRuler } from "./Visualizations";

describe("error ruler", () => {
  it("connects the recovery of Ceres to an interactive loss function", () => {
    render(<ErrorRuler />);

    expect(screen.getByText(/Giuseppe Piazzi/i)).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /ximo passo/i });
    fireEvent.click(nextButton);
    expect(screen.getByText(/muitas .rbitas/i)).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText(/erro total/i)).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText(/ajudou astr.nomos a reencontrar Ceres/i)).toBeInTheDocument();

    fireEvent.click(nextButton);
    const slider = screen.getByRole("slider", { name: /ajuste a previs.o/i });
    fireEvent.change(slider, { target: { value: "1" } });

    expect(screen.getByText(/previs.o = alvo . perda = 0/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rever hist.ria/i })).toBeInTheDocument();
  });
});
