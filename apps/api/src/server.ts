import { createServer } from "node:http";
import { env } from "./config/env";
import { createApp } from "./app";
import { initRealtime } from "./realtime/socket";

const app = createApp();

const httpServer = createServer(app);
initRealtime(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(
    `API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`
  );
});
