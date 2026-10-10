import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app, ADMIN, CLIENT, loginAs, uniqueVmName } from "./helpers";

let adminCookie: string;
let clientCookie: string;

const validVm = () => ({
  name: uniqueVmName(),
  cores: 2,
  ramGb: 4,
  diskGb: 40,
  os: "UBUNTU_24_04",
  status: "STOPPED",
});

beforeAll(async () => {
  adminCookie = await loginAs(ADMIN);
  clientCookie = await loginAs(CLIENT);
});

describe("Acceso a /api/vms", () => {
  it("responde 401 sin sesión", async () => {
    const res = await request(app).get("/api/vms");
    expect(res.status).toBe(401);
  });

  it("el Cliente puede listar las VMs", async () => {
    const res = await request(app).get("/api/vms").set("Cookie", clientCookie);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(8); // las 8 del seed
  });
});

describe("El Cliente no puede modificar VMs (403)", () => {
  it("no puede crear", async () => {
    const res = await request(app)
      .post("/api/vms")
      .set("Cookie", clientCookie)
      .send(validVm());
    expect(res.status).toBe(403);
  });

  it("no puede actualizar ni eliminar", async () => {
    const created = await request(app)
      .post("/api/vms")
      .set("Cookie", adminCookie)
      .send(validVm());
    const id = created.body.id;

    const put = await request(app)
      .put(`/api/vms/${id}`)
      .set("Cookie", clientCookie)
      .send({ status: "RUNNING" });
    expect(put.status).toBe(403);

    const del = await request(app)
      .delete(`/api/vms/${id}`)
      .set("Cookie", clientCookie);
    expect(del.status).toBe(403);
  });
});

describe("CRUD del Administrador", () => {
  it("crea, actualiza y elimina una VM", async () => {
    const create = await request(app)
      .post("/api/vms")
      .set("Cookie", adminCookie)
      .send(validVm());
    expect(create.status).toBe(201);
    const id = create.body.id;

    const update = await request(app)
      .put(`/api/vms/${id}`)
      .set("Cookie", adminCookie)
      .send({ status: "RUNNING" });
    expect(update.status).toBe(200);
    expect(update.body.status).toBe("RUNNING");

    const remove = await request(app)
      .delete(`/api/vms/${id}`)
      .set("Cookie", adminCookie);
    expect(remove.status).toBe(204);

    const list = await request(app).get("/api/vms").set("Cookie", adminCookie);
    expect(
      list.body.find((vm: { id: string }) => vm.id === id)
    ).toBeUndefined();
  });

  it("responde 409 si el nombre ya existe, señalando el campo name", async () => {
    const vm = validVm();
    await request(app).post("/api/vms").set("Cookie", adminCookie).send(vm);
    const res = await request(app)
      .post("/api/vms")
      .set("Cookie", adminCookie)
      .send(vm);
    expect(res.status).toBe(409);
    expect(res.body.error.details[0].field).toBe("name");
  });
});

describe("Validaciones", () => {
  it("rechaza RAM negativa y nombre con formato inválido (400)", async () => {
    const res = await request(app)
      .post("/api/vms")
      .set("Cookie", adminCookie)
      .send({ ...validVm(), name: "Mala_VM", ramGb: -4 });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map(
      (d: { field: string }) => d.field
    );
    expect(fields).toEqual(expect.arrayContaining(["name", "ramGb"]));
  });

  it("rechaza un body vacío al actualizar (400)", async () => {
    const created = await request(app)
      .post("/api/vms")
      .set("Cookie", adminCookie)
      .send(validVm());
    const res = await request(app)
      .put(`/api/vms/${created.body.id}`)
      .set("Cookie", adminCookie)
      .send({});
    expect(res.status).toBe(400);
  });

  it("rechaza un id que no es UUID (400)", async () => {
    const res = await request(app)
      .delete("/api/vms/hola")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(400);
  });

  it("responde 404 si la VM no existe", async () => {
    const res = await request(app)
      .put("/api/vms/00000000-0000-4000-8000-000000000000")
      .set("Cookie", adminCookie)
      .send({ status: "RUNNING" });
    expect(res.status).toBe(404);
  });
});
