import type { VmOs, VmStatus } from "@vm/shared";

export const OS_LABELS: Record<VmOs, string> = {
  UBUNTU_24_04: "Ubuntu 24.04 LTS",
  DEBIAN_12: "Debian 12",
  ROCKY_9: "Rocky Linux 9",
  WINDOWS_SERVER_2022: "Windows Server 2022",
};

export const STATUS_LABELS: Record<VmStatus, string> = {
  RUNNING: "Encendida",
  STOPPED: "Apagada",
};
