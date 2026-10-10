import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Vm } from "@vm/shared";
import { socket } from "@/lib/socket";
import { useHighlightStore } from "@/stores/highlight-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { isOptimisticVm } from "./vms.mutations";
import { vmKeys } from "./vms.queries";

const isNotOlder = (incoming: Vm, current: Vm) =>
  Date.parse(incoming.updatedAt) >= Date.parse(current.updatedAt);

export function useVmRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { highlight } = useHighlightStore.getState();
    const { setStatus } = useRealtimeStore.getState();

    const upsert = (vm: Vm) => {
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old) => {
        if (!old) return old;

        if (old.some((item) => item.id === vm.id)) {
          return old.map((item) =>
            item.id === vm.id && isNotOlder(vm, item) ? vm : item
          );
        }
        const tempIndex = old.findIndex(
          (item) => isOptimisticVm(item) && item.name === vm.name
        );
        if (tempIndex !== -1) {
          return old.map((item, index) => (index === tempIndex ? vm : item));
        }
        return [vm, ...old];
      });
      highlight(vm.id);
    };

    const remove = ({ id }: { id: string }) => {
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old) =>
        old?.filter((item) => item.id !== id)
      );
    };

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onReconnectAttempt = () => setStatus("connecting");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.on("vm:created", upsert);
    socket.on("vm:updated", upsert);
    socket.on("vm:deleted", remove);

    setStatus("connecting");
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.off("vm:created", upsert);
      socket.off("vm:updated", upsert);
      socket.off("vm:deleted", remove);
      socket.disconnect();
    };
  }, [queryClient]);
}
