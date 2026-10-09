import { VmCreateInput } from "./vm.types";

export interface Vm extends VmCreateInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
