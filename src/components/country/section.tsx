import { cn } from "@/lib/utils";

export function Section({
  title,
  icon,
  subtitle,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-8 first:pt-0", className)}>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="-mt-3 mb-4 text-sm text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
