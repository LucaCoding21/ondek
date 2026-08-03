/**
 * The label that opens a section: a small bold word, then a hairline across
 * the full width beneath it. Every section on the site uses this, so the rule
 * is what separates one from the next.
 */
export default function SectionLabel({
  children,
  onDark = false,
  rule = true,
  className = "",
}: {
  children: React.ReactNode;
  /** Sections that sit on the dark neutral, where the rule has to lighten */
  onDark?: boolean;
  /** Off where the section already has an edge of its own, such as a panel */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`text-sm font-bold ${onDark ? "text-white" : ""}`}>
        {children}
      </p>
      {rule && (
        <div
          className={`mt-5 border-b ${
            onDark ? "border-white/20" : "border-foreground/10"
          }`}
        />
      )}
    </div>
  );
}
