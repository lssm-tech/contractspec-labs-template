'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Columns2, Rows3 } from 'lucide-react';
import { computeDiff, InlineView, SideBySideView } from './DiffViewerParts';

export type DiffMode = 'inline' | 'side-by-side';

export type DiffViewerProps = React.HTMLAttributes<HTMLDivElement> & {
  before: string;
  after: string;
  mode?: DiffMode;
  title?: string;
  sectionFilter?: string[];
};

/** Simple diff viewer with inline and side-by-side modes. */
export function DiffViewer({
  before,
  after,
  mode: initialMode = 'inline',
  title,
  sectionFilter,
  className,
  ...props
}: DiffViewerProps) {
  const [mode, setMode] = React.useState<DiffMode>(initialMode);
  let lines = React.useMemo(() => computeDiff(before, after), [before, after]);

  if (sectionFilter?.length) {
    lines = lines.filter((l) =>
      sectionFilter.some((s) => l.content.includes(s))
    );
  }

  return (
    <div
      className={cn(
        'bg-background overflow-hidden rounded-lg border',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-sm font-medium">{title ?? 'Diff'}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('inline')}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              mode === 'inline' ? 'bg-muted' : 'hover:bg-muted/50'
            )}
            aria-label="Inline view"
            aria-pressed={mode === 'inline'}
          >
            <Rows3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMode('side-by-side')}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              mode === 'side-by-side' ? 'bg-muted' : 'hover:bg-muted/50'
            )}
            aria-label="Side-by-side view"
            aria-pressed={mode === 'side-by-side'}
          >
            <Columns2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Diff content */}
      <div className="overflow-x-auto">
        {mode === 'inline' ? (
          <InlineView lines={lines} />
        ) : (
          <SideBySideView lines={lines} />
        )}
      </div>
    </div>
  );
}
