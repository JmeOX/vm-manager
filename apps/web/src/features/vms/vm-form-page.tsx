import { useParams } from "react-router";
import { PageHeader } from "@/components/page-header";

export function VmFormPage() {
  const { id } = useParams();
  return (
    <PageHeader
      title={id ? "Editar máquina virtual" : "Nueva máquina virtual"}
    />
  );
}
