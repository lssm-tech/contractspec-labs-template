/**
 * ExecSummary — renders an executive summary card.
 * Used in share link pages and report previews.
 */

export interface ExecSummaryProps {
  title?: string;
  summary: string;
  className?: string;
}

/** Executive summary card for share link and report pages. */
export function ExecSummary({
  title = 'Executive Summary',
  summary,
  className = '',
}: ExecSummaryProps) {
  if (!summary.trim()) {
    return null;
  }

  return (
    <section
      aria-label={title}
      className={`rounded-lg border p-4 ${className}`}
    >
      <h2 className="text-foreground mb-2 text-lg font-semibold">{title}</h2>
      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground">{summary}</p>
      </div>
    </section>
  );
}
