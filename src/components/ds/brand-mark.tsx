// The Delta Scaling mark, painted in the site's sun yellow (follows the theme token).
// The logo file is used as a stencil, so its shape stays exact.
export function BrandMark({ size, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`ds-mark ${className}`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}
