import type { Request, Response } from "express";
import * as vmsService from "./vms.service";

export async function list(_req: Request, res: Response) {
  res.json(await vmsService.list());
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await vmsService.create(req.body)); // 201 = creado
}

export async function update(req: Request<{ id: string }>, res: Response) {
  res.json(await vmsService.update(req.params.id, req.body));
}

export async function remove(req: Request<{ id: string }>, res: Response) {
  await vmsService.remove(req.params.id);
  res.status(204).end();
}
