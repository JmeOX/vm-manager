import request from "supertest";
import { createApp } from "../src/app";

export const app = createApp();

export const ADMIN = { email: "admin@ifx.test", password: "Admin123!" };
export const CLIENT = { email: "cliente@ifx.test", password: "Cliente123!" };

export async function loginAs(credentials: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await request(app).post("/api/auth/login").send(credentials);
  const setCookie = res.headers["set-cookie"] as unknown as string[];
  return setCookie[0].split(";")[0];
}

export const uniqueVmName = () =>
  `t-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
