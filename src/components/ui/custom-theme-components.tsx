import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import { SelectItem, SelectContent } from "@/components/ui/select";

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

export function ThemeAwareDropdownMenuItem({ 
  children, 
  onClick,
  className,
  ...props 
}: { 
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof DropdownMenuItem>) {
  const itemClass = useMountedThemeClass(
    "hover:bg-gray-900",
    "hover:bg-gray-100"
  );

  if (!itemClass) {
    return <DropdownMenuItem onClick={onClick} className={className} {...props}>{children}</DropdownMenuItem>;
  }

  return <DropdownMenuItem onClick={onClick} className={cn(itemClass, className)} {...props}>{children}</DropdownMenuItem>;
}

export function ThemeAwareSelectItem({ 
  children, 
  className,
  ...props 
}: { 
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof SelectItem>) {
  const itemClass = useMountedThemeClass(
    "hover:bg-gray-900",
    "hover:bg-gray-100"
  );

  if (!itemClass) {
    return <SelectItem className={className} {...props}>{children}</SelectItem>;
  }

  return <SelectItem className={cn(itemClass, className)} {...props}>{children}</SelectItem>;
}

export function ThemeAwareSelectContent({ 
  children, 
  className,
  ...props 
}: { 
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof SelectContent>) {
  const contentClass = useMountedThemeClass(
    
    "bg-black text-white",
    "bg-white text-black"
  );

  if (!contentClass) {
    return <SelectContent className={className} {...props}>{children}</SelectContent>;
  }

  return <SelectContent className={cn(contentClass, className)} {...props}>{children}</SelectContent>;
}

export function ThemeAwareModal({ 
  children, 
  className,
  ...props 
}: { 
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const modalClass = useMountedThemeClass(
    "bg-black/50",
    "bg-black/50"
  );

  const contentClass = useMountedThemeClass(
    "bg-black text-white border-gray-800",
    "bg-white text-black border-gray-200"
  );

  const closeButtonClass = useMountedThemeClass(
    "text-gray-400 hover:text-gray-200",
    "text-gray-500 hover:text-gray-800"
  );

  if (!modalClass || !contentClass) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-white p-8 rounded-xl w-full max-w-xl mx-auto shadow-md">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center", modalClass)} {...props}>
      <div className={cn("relative p-8 rounded-xl w-full max-w-xl mx-auto shadow-md border", contentClass, className)}>
        {children}
      </div>
    </div>
  );
} 