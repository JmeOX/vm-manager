import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, ADMIN, loginAs } from "./helpers";

describe("POST /api/auth/login", () => {
  it("responde 200 con el usuario y su rol", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ email: ADMIN.email, role: "ADMIN" });
  });

  it("NO devuelve el token en el body", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN);
    expect(res.body).not.toHaveProperty("token");
    expect(JSON.stringify(res.body)).not.toContain("eyJ"); // un JWT siempre empieza por "eyJ"
  });

  it("establece la cookie de sesión con HttpOnly, Secure y SameSite=Strict", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN);
    const cookie = (res.headers["set-cookie"] as unknown as string[])[0];
    expect(cookie).toMatch(/^vm_session=/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("nunca expone el passwordHash", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN);
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("responde 401 con mensaje genérico si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ ...ADMIN, password: "mala" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("responde 400 con detalle por campo si los datos son inválidos", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "no-es-email", password: "" });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map(
      (d: { field: string }) => d.field
    );
    expect(fields).toEqual(expect.arrayContaining(["email", "password"]));
  });
});

describe("GET /api/auth/me", () => {
  it("responde 401 sin cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("devuelve el usuario con una cookie válida", async () => {
    const cookie = await loginAs(ADMIN);
    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("ADMIN");
  });

  it("responde 401 si el token fue manipulado", async () => {
    const cookie = await loginAs(ADMIN);
    const tampered = cookie.slice(0, -3) + "abc"; // cambia los últimos caracteres de la firma
    const res = await request(app).get("/api/auth/me").set("Cookie", tampered);
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_SESSION");
  });
});
