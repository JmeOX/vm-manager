import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@vm/shared";

const BASE_URL = "http://localhost:4000";
const withCookie = !process.argv.includes("--sin-cookie");

async function getSessionCookie(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "cliente@ifx.test",
      password: "Cliente123!",
    }),
  });
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) throw new Error(`Login falló (${res.status})`);
  return setCookie.split(";")[0];
}

const cookie = withCookie ? await getSessionCookie() : undefined;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    extraHeaders: cookie ? { cookie } : {},
  }
);

socket.on("connect", () =>
  console.log(
    "✅ Conectado como Cliente. Esperando eventos... (Ctrl+C para salir)"
  )
);
socket.on("connect_error", (err) => {
  console.log(`❌ Conexión rechazada: ${err.message}`);
  socket.close();
});
socket.on("vm:created", (vm) => console.log(`📥 vm:created → ${vm.name}`));
socket.on("vm:updated", (vm) =>
  console.log(`📥 vm:updated → ${vm.name} ahora está ${vm.status}`)
);
socket.on("vm:deleted", ({ id }) => console.log(`📥 vm:deleted → ${id}`));
