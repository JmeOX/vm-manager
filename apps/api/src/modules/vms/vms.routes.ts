import { Router } from "express";
import { z } from "zod";
import { vmCreateSchema, vmUpdateSchema } from "@vm/shared";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validateBody, validateParams } from "../../middleware/validate";
import * as vmsController from "./vms.controller";

const idParamsSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
});

export const vmsRouter = Router();

vmsRouter.use(authenticate);

vmsRouter.get("/", vmsController.list);

vmsRouter.post(
  "/",
  authorize("ADMIN"),
  validateBody(vmCreateSchema),
  vmsController.create
);
vmsRouter.put(
  "/:id",
  authorize("ADMIN"),
  validateParams(idParamsSchema),
  validateBody(vmUpdateSchema),
  vmsController.update
);
vmsRouter.delete(
  "/:id",
  authorize("ADMIN"),
  validateParams(idParamsSchema),
  vmsController.remove
);
