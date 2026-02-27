'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Pill } from '../atoms/Pill';

export type ClaimStatus = 'inferred' | 'confirmed' | 'corrected' | 'outdated';

const borderVariants = cva(
  'group relative rounded-md border-l-4 px-3 py-2 transition-colors',
  {
    variants: {
      status: {
        inferred: 'border-l-accent/60 bg-accent/5',
        confirmed: 'border-l-success-foreground/60 bg-success/5',
        corrected: 'border-l-warning/60 bg-warning/5',
        outdated: 'border-l-destructive/60 bg-destructive/5',
      },
      selected: {
        true: 'ring-2 ring-primary/40',
        false: '',
      },
    },
    defaultVariants: { status: 'inferred', selected: false },
  }
);

const statusLabels: Record<ClaimStatus, string> = {
  inferred: 'Inferred',
  confirmed: 'Confirmed',
  corrected: 'Corrected',
  outdated: 'Outdated',
};

export type ClaimHighlightProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The claim statement text */
  statement: string;
  status: ClaimStatus;
  /** Confidence score 0-1 or 0-100 */
  confidence: number;
  isAssumption?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  /** Quick action buttons revealed on hover */
  actions?: React.ReactNode;
};

/** Highlighted claim span with status border, confidence pill, and keyboard access. */
export function ClaimHighlight({
  statement,
  status,
  confidence,
  isAssumption = false,
  isSelected = false,
  onSelect,
  actions,
  className,
  ...props
}: ClaimHighlightProps) {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
        e.preventDefault();
        onSelect();
      }
    },
    [onSelect]
  );

  return (
    <div
      {...(onSelect
        ? {
            role: 'button' as const,
            tabIndex: 0,
            'aria-pressed': isSelected,
            onClick: onSelect,
            onKeyDown: handleKeyDown,
          }
        : {})}
      className={cn(
        borderVariants({ status, selected: isSelected }),
        onSelect &&
          'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 text-sm leading-relaxed">{statement}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Pill value={confidence} size="sm" />
          <Badge variant="outline" className="text-xs">
            {statusLabels[status]}
          </Badge>
          {isAssumption && (
            <Badge variant="outline" className="text-warning gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>
      {actions && (
        <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          {actions}
        </div>
      )}
    </div>
  );
}
