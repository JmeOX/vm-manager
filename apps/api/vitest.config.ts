import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./test.db",
      JWT_SECRET: "secreto-solo-para-tests-de-al-menos-32-caracteres",
    },
    globalSetup: "./tests/global-setup.ts",
    fileParallelism: false,
  },
});
