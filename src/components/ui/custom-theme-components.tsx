import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";

function useMountedThemeClass(darkClass: string, lightClass: string) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return resolvedTheme === "dark" ? darkClass : lightClass;
}

interface ThemeAwareAddButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export function ThemeAwareAddButton({ onClick, children }: ThemeAwareAddButtonProps) {
  const buttonClass = useMountedThemeClass(
    "px-5 py-2.5 text-sm font-medium rounded-md bg-white text-black hover:bg-white/80 transition-colors",
    "px-5 py-2.5 text-sm font-medium rounded-md bg-black text-white hover:bg-black/80 transition-colors"
  );

  if (!buttonClass) {
    return (
      <Button
        onClick={onClick}
        className="px-5 py-2.5 text-sm font-medium rounded-md bg-black text-white transition-colors"
      >
        {children}
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className={buttonClass}>
      {children}
    </Button>
  );
}

export function ThemeAwareDropdownMenuContent({ children }: { children: ReactNode }) {
  const contentClass = useMountedThemeClass(
    "bg-black text-white shadow-lg",
    "bg-white text-black shadow-lg"
  );

  if (!contentClass) {
    return <DropdownMenuContent>{children}</DropdownMenuContent>;
  }

  return <DropdownMenuContent className={contentClass}>{children}</DropdownMenuContent>;
}