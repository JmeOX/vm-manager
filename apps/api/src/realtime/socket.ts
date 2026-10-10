import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { parse } from "cookie";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
  Vm,
} from "@vm/shared";

import { env, COOKIE_NAME } from "../config/env";
import { verifySessionToken, type SessionUser } from "../lib/session";

interface SocketData {
  user: SessionUser;
}

let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
> | null = null;

export function initRealtime(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN, credentials: true },
  });
  io.use((socket, next) => {
    const cookies = parse(socket.handshake.headers.cookie ?? "");
    const token = cookies[COOKIE_NAME];
    if (!token) {
      return next(new Error("UNAUTHENTICATED"));
    }

    let user: SessionUser;
    try {
      user = verifySessionToken(token);
    } catch {
      return next(new Error("INVALID_SESSION"));
    }

    socket.data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`[socket] conectado: ${socket.data.user.role} (${socket.id})`);
    socket.on("disconnect", () => {
      console.log(`[socket] desconectado: ${socket.id}`);
    });
  });
}

export const realtime = {
  vmCreated: (vm: Vm) => io?.emit("vm:created", vm),
  vmUpdated: (vm: Vm) => io?.emit("vm:updated", vm),
  vmDeleted: (id: string) => io?.emit("vm:deleted", { id }),
};
