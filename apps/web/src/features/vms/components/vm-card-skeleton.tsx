import { Skeleton } from "@/components/ui/skeleton";

export function VmCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-6"
      aria-hidden="true"
    >
      <div className="flex justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3.5 w-2/5" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-[52px]" />
        <Skeleton className="h-[52px]" />
        <Skeleton className="h-[52px]" />
      </div>
    </div>
  );
}
