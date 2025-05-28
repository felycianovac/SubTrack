import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState, ReactNode, MouseEventHandler } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { SelectItem, SelectContent } from "@/components/ui/select";
import type { Currency } from "@/types/subscription";
import { Badge } from "@/components/ui/badge";

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

export function ThemeAwareDropdownMenuContent({ 
  children, 
  className,
  align,
  ...props 
}: { 
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
} & React.ComponentPropsWithoutRef<typeof DropdownMenuContent>) {
  const contentClass = useMountedThemeClass(
    "bg-black text-white shadow-lg",
    "bg-white text-black shadow-lg"
  );

  if (!contentClass) {
    return <DropdownMenuContent className={className} align={align} {...props}>{children}</DropdownMenuContent>;
  }

  return <DropdownMenuContent className={cn(contentClass, className)} align={align} {...props}>{children}</DropdownMenuContent>;
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

export function ThemeAwareProgressBar({ 
  value,
  maxValue,
  className,
  ...props 
}: { 
  value: number;
  maxValue: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const trackClass = useMountedThemeClass(
    "bg-gray-800",
    "bg-gray-100"
  );

  const barClass = useMountedThemeClass(
    "bg-white",
    "bg-black"
  );

  if (!trackClass || !barClass) {
    return (
      <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)} {...props}>
        <div
          className="h-full bg-black"
          style={{
            width: `${Math.min(100, (value / maxValue) * 100)}%`,
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full h-2 rounded-full overflow-hidden", trackClass, className)} {...props}>
      <div
        className={cn("h-full", barClass)}
        style={{
          width: `${Math.min(100, (value / maxValue) * 100)}%`,
        }}
      />
    </div>
  );
}

export function ThemeAwareCalendarDay({ 
  day,
  isToday,
  children,
  className,
  ...props 
}: { 
  day: number | null;
  isToday: boolean;
  children?: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const dayClass = useMountedThemeClass(
    "bg-black/20 hover:bg-black/30 border-gray-800",
    "bg-muted/20 hover:bg-muted/50 border-gray-200"
  );

  const todayClass = useMountedThemeClass(
    "border-white",
    "border-black"
  );

  if (!dayClass) {
    return (
      <div
        className={cn(
          "min-h-[80px] p-1 border rounded-md",
          day === null ? "bg-muted/20" : "hover:bg-muted/50",
          isToday ? "border-black" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-[80px] p-1 border rounded-md",
        day === null ? dayClass : dayClass,
        isToday ? todayClass : "border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ThemeAwareSubscriptionItem({ 
  name, 
  price, 
  currency, 
  billingCycle 
}: { 
  name: string
  price: number
  currency: Currency
  billingCycle: { interval: number; unit: string }
}) {
  const itemClass = useMountedThemeClass(
    "bg-white/10 text-white",
    "bg-black/10 text-black"
  );

  const formatBillingCycle = (billingCycle: { interval: number; unit: string }): string => {
    if (billingCycle.interval === 1) {
      return billingCycle.unit.slice(0, -1) + "ly" // e.g., "monthly", "yearly"
    }
    return `every ${billingCycle.interval} ${billingCycle.unit}`
  }

  if (!itemClass) {
    return (
      <div
        className="text-xs px-2 py-1 rounded-full bg-black/10 text-black truncate"
        title={`${name} - ${formatCurrency(price, currency)}/${formatBillingCycle(billingCycle)}`}
      >
        {name}
      </div>
    );
  }

  return (
    <div
      className={`text-xs px-2 py-1 rounded-full ${itemClass} truncate`}
      title={`${name} - ${formatCurrency(price, currency)}/${formatBillingCycle(billingCycle)}`}
    >
      {name}
    </div>
  );
} 

export function ThemeAwareBadge({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Badge>) {
  const badgeClass = useMountedThemeClass(
    "bg-gray-800 text-white",
    "bg-gray-100 text-black"
  );

  if (!badgeClass) {
    return (
      <Badge className={className} {...props}>
        {children}
      </Badge>
    );
  }

  return (
    <Badge className={cn(badgeClass, className)} {...props}>
      {children}
    </Badge>
  );
}