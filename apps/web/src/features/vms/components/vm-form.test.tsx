import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { Vm } from "@vm/shared";
import { vmsApi } from "../vms.api";
import { vmKeys } from "../vms.queries";
import { VmForm } from "./vm-form";

vi.mock("../vms.api", () => ({
  vmsApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

const existing: Vm = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "web-01",
  cores: 2,
  ramGb: 4,
  diskGb: 50,
  os: "UBUNTU_24_04",
  status: "RUNNING",
  createdAt: "2026-10-10T00:00:00.000Z",
  updatedAt: "2026-10-10T00:00:00.000Z",
};

async function renderForm() {
  vi.mocked(vmsApi.list).mockResolvedValue([existing]);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <VmForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() =>
    expect(queryClient.getQueryData(vmKeys.all)).toBeDefined()
  );
}

describe("<VmForm> validación en tiempo real", () => {
  it("muestra los errores mientras se escribe y bloquea el envío", async () => {
    const user = userEvent.setup();
    await renderForm();
    const submit = screen.getByRole("button", { name: "Crear VM" });
    const name = screen.getByLabelText("Nombre");
    const ram = screen.getByLabelText("RAM");

    await user.type(name, "Web_01");
    expect(await screen.findByText(/3–32 caracteres/)).toBeInTheDocument();
    expect(submit).toBeDisabled();

    await user.clear(name);
    await user.type(name, "web-01");
    expect(
      await screen.findByText("Ya existe una VM con ese nombre")
    ).toBeInTheDocument();

    await user.clear(ram);
    await user.type(ram, "-4");
    expect(await screen.findByText("Mínimo 1 GB")).toBeInTheDocument();

    await user.clear(name);
    await user.type(name, "web-09");
    await user.clear(ram);
    await user.type(ram, "8");
    await waitFor(() => expect(submit).toBeEnabled());
  });
});
