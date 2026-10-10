import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Vm } from "@vm/shared";
import { ApiError } from "@/lib/http";
import { vmsApi } from "./vms.api";
import { useDeleteVm, useUpdateVm } from "./vms.mutations";
import { vmKeys } from "./vms.queries";

vi.mock("./vms.api", () => ({
  vmsApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const vm: Vm = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "web-01",
  cores: 2,
  ramGb: 4,
  diskGb: 50,
  os: "UBUNTU_24_04",
  status: "STOPPED",
  createdAt: "2026-10-10T00:00:00.000Z",
  updatedAt: "2026-10-10T00:00:00.000Z",
};

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  queryClient.setQueryData(vmKeys.all, [vm]);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const cached = () => queryClient.getQueryData<Vm[]>(vmKeys.all);
  return { wrapper, cached };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(() => vi.clearAllMocks());

describe("Optimistic UI", () => {
  it("encender: cambia al instante y se revierte si la API falla", async () => {
    const request = deferred<Vm>();
    vi.mocked(vmsApi.update).mockReturnValue(request.promise);
    const { wrapper, cached } = setup();
    const { result } = renderHook(() => useUpdateVm(), { wrapper });

    act(() => result.current.mutate({ vm, input: { status: "RUNNING" } }));

    await waitFor(() => expect(cached()?.[0].status).toBe("RUNNING"));

    act(() =>
      request.reject(new ApiError(503, "SIMULATED_FAILURE", "Fallo simulado"))
    );

    await waitFor(() => expect(cached()?.[0].status).toBe("STOPPED"));
    expect(toast.error).toHaveBeenCalledOnce();
  });

  it("encender: se mantiene si la API confirma", async () => {
    vi.mocked(vmsApi.update).mockResolvedValue({ ...vm, status: "RUNNING" });
    const { wrapper, cached } = setup();
    const { result } = renderHook(() => useUpdateVm(), { wrapper });

    act(() => result.current.mutate({ vm, input: { status: "RUNNING" } }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledOnce());
    expect(cached()?.[0].status).toBe("RUNNING");
  });

  it("eliminar: desaparece al instante y se restaura si la API falla", async () => {
    const request = deferred<void>();
    vi.mocked(vmsApi.remove).mockReturnValue(request.promise);
    const { wrapper, cached } = setup();
    const { result } = renderHook(() => useDeleteVm(), { wrapper });

    act(() => result.current.mutate(vm));
    await waitFor(() => expect(cached()).toHaveLength(0));

    act(() =>
      request.reject(new ApiError(503, "SIMULATED_FAILURE", "Fallo simulado"))
    );
    await waitFor(() => expect(cached()).toHaveLength(1));
    expect(toast.error).toHaveBeenCalledOnce();
  });
});
