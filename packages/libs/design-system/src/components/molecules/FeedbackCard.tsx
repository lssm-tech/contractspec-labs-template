'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { Pill } from '../atoms/Pill';
import { getDesignSystemLocale } from '../../lib/utils';

const FEEDBACK_CARD_COPY = {
  openSource: {
    en: 'Open',
    fr: 'Ouvrir',
    es: 'Abrir',
  },
  assumption: {
    en: 'Assumption',
    fr: 'Hypothese',
    es: 'Suposicion',
  },
  captured: {
    en: 'Captured',
    fr: 'Capture le',
    es: 'Capturado',
  },
} as const;

export type FeedbackCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Source display name */
  sourceName: string;
  /** URL link to the source */
  sourceUrl: string;
  /** Excerpt / snippet text */
  snippet: string;
  /** ISO date string when the feedback was captured */
  capturedAt: string;
  /** Confidence score 0-1 or 0-100 */
  confidence: number;
  /** Flags the feedback as an assumption rather than confirmed */
  isAssumption?: boolean;
  /** Action slot rendered at the bottom-right */
  actions?: React.ReactNode;
};

/** Card displaying a single piece of feedback with source, snippet, and confidence. */
export function FeedbackCard({
  sourceName,
  sourceUrl,
  snippet,
  capturedAt,
  confidence,
  isAssumption = false,
  actions,
  className,
  ...props
}: FeedbackCardProps) {
  const locale = getDesignSystemLocale();
  const formattedDate = new Date(capturedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      className={cn('transition-shadow hover:shadow-md', className)}
      {...props}
    >
      <CardContent className="space-y-3 p-4">
        {/* Header: source + badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="truncate text-sm font-medium">{sourceName}</span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
              aria-label={`${FEEDBACK_CARD_COPY.openSource[locale]} ${sourceName}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Pill value={confidence} size="sm" />
            {isAssumption && (
              <Badge variant="outline" className="text-warning gap-1">
                <AlertTriangle className="h-3 w-3" />
                {FEEDBACK_CARD_COPY.assumption[locale]}
              </Badge>
            )}
          </div>
        </div>

        {/* Snippet */}
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {snippet}
        </p>

        {/* Footer: date + actions */}
        <div className="flex items-center justify-between">
          <time dateTime={capturedAt} className="text-muted-foreground text-xs">
            {FEEDBACK_CARD_COPY.captured[locale]} {formattedDate}
          </time>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
