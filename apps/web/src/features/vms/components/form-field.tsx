import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  error,
  hint,
  aside,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {aside}
      </div>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-sm text-destructive"
        >
          <AlertCircle
            className="mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const fieldDescribedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;
