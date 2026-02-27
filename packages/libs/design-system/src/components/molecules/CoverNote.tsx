/**
 * CoverNote — renders a markdown cover note in a styled card.
 * Used in share link pages and deliverable previews.
 */

export interface CoverNoteProps {
  content: string;
  className?: string;
}

/** Styled cover note card for share link pages. */
export function CoverNote({ content, className = '' }: CoverNoteProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <section
      aria-label="Cover note"
      className={`bg-muted/30 rounded-lg border p-4 ${className}`}
    >
      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
        {content}
      </div>
    </section>
  );
}
