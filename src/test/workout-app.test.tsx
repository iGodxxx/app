import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "@/routes/index";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Workout app regression", () => {
  it("renders the initial page and every tab without undefined components", () => {
    render(<App />);
    for (const label of ["Treinos", "Explorar", "Evolução", "Perfil", "Início"]) {
      fireEvent.click(screen.getAllByRole("button", { name: label, exact: true })[0] as HTMLElement);
      expect(screen.getByRole("main")).toBeTruthy();
    }
  });

  it("completes a workout and reads it back in the progress view", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Começar treino" }));
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Próximo exercício" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Concluir treino" }));
    const state = JSON.parse(localStorage.getItem("calistenia-asiatica-state") ?? "{}");
    expect(state.history[0].title).toBe("Corpo inteiro em movimento");
    expect(state.history[0].duration).toBe(18);
    expect(state.completedDays).toEqual([1]);
  });
});