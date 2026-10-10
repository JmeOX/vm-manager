import { useDevStore } from "@/stores/dev-store";

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: FieldError[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: FieldError[]
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const devHeaders: Record<string, string> =
    import.meta.env.DEV && useDevStore.getState().simulateFailures
      ? { "x-simulate-failure": "1" }
      : {};
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...devHeaders,
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "No se pudo conectar con el servidor"
    );
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? "UNKNOWN_ERROR",
      body?.error?.message ?? "Ocurrió un error inesperado",
      body?.error?.details
    );
  }
  return body as T;
}
