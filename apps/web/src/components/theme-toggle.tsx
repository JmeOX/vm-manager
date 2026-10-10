import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/app/theme-provider";

const NEXT_THEME: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};
const LABELS: Record<Theme, string> = {
  light: "Light Theme",
  dark: "Dark Theme",
  system: "System Theme",
};
const ICONS = { light: Sun, dark: Moon, system: Monitor };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(NEXT_THEME[theme])}
      aria-label={`${LABELS[theme]}. click to change theme`}
      title={LABELS[theme]}
    >
      <Icon className="size-5" />
    </Button>
  );
}
