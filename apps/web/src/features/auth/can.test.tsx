import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UserRole } from "@vm/shared";
import { useSession } from "./use-session";
import { Can } from "./can";

vi.mock("./use-session", () => ({ useSession: vi.fn() }));

const loginAs = (role: UserRole) =>
  vi.mocked(useSession).mockReturnValue({
    data: { id: "1", email: "test@ifx.test", name: "Test", role },
  } as unknown as ReturnType<typeof useSession>);

describe("<Can>", () => {
  it("el Cliente NO tiene el botón en el DOM (no solo deshabilitado)", () => {
    loginAs("CLIENT");
    render(
      <Can role="ADMIN">
        <button>Eliminar</button>
      </Can>
    );
    expect(
      screen.queryByRole("button", { name: "Eliminar" })
    ).not.toBeInTheDocument();
  });

  it("el Admin sí ve el botón", () => {
    loginAs("ADMIN");
    render(
      <Can role="ADMIN">
        <button>Eliminar</button>
      </Can>
    );
    expect(
      screen.getByRole("button", { name: "Eliminar" })
    ).toBeInTheDocument();
  });
});
