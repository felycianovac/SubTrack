import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";

interface ThemeAwareAddButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export function ThemeAwareAddButton({ onClick, children }: ThemeAwareAddButtonProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        onClick={onClick}
        className="px-5 py-2.5 text-sm font-medium rounded-md bg-black text-white transition-colors"
      >
        {children}
      </Button>
    );
  }

  const buttonClass =
    resolvedTheme === "dark"
      ? "px-5 py-2.5 text-sm font-medium rounded-md bg-white text-black hover:bg-white/80 transition-colors"
      : "px-5 py-2.5 text-sm font-medium rounded-md bg-black text-white hover:bg-black/80 transition-colors";

  return (
    <Button onClick={onClick} className={buttonClass}>
      {children}
    </Button>
  );
}
