import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Can } from "@/features/auth/can";

export function VmListPage() {
  return (
    <PageHeader
      title="Máquinas virtuales"
      description="Listado de máquinas"
      actions={
        <Can role="ADMIN">
          <Button asChild className="h-11 font-semibold">
            <Link to="/vms/new">
              <Plus aria-hidden="true" />
              Nueva VM
            </Link>
          </Button>
        </Can>
      }
    />
  );
}
