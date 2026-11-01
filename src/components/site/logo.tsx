// Mark geometry from the site's own favicon (four quarter-circles forming a D).
export function LogoMark({ size = 28, a = "var(--brand)", b = "currentColor" }: { size?: number; a?: string; b?: string }) {
  return (
    <svg width={size} height={size} viewBox="12 12 40 40" aria-hidden>
      <g fill={a}>
        <path d="M12 12h19a19 19 0 0 1-19 19Z" />
        <path d="M12 33a19 19 0 0 1 19 19H12Z" />
      </g>
      <g fill={b}>
        <path d="M33 12a19 19 0 0 1 19 19H33Z" />
        <path d="M33 33h19a19 19 0 0 1-19 19Z" />
      </g>
    </svg>
  );
}

export function Logo({ mono = false }: { mono?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={26} a={mono ? "currentColor" : "var(--brand)"} />
      <span className="font-heading text-[17px] font-semibold tracking-tight">
        Delta <span className="font-normal text-muted-foreground">Scaling</span>
      </span>
    </span>
  );
}
