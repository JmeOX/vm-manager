import { createApp } from "./app";

const PORT = Number(process.env.PORT_API ?? 4000);

createApp().listen(PORT, () => {
  console.log(`API Listening on port ${PORT}`);
});
