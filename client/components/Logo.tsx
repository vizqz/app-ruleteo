import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="font-heading tracking-wide text-2xl text-primary">Ruleteo</span>
      <span className="px-2 py-0.5 rounded-md text-xs bg-muted text-foreground/80">MVP</span>
    </div>
  );
}
export default Logo;
