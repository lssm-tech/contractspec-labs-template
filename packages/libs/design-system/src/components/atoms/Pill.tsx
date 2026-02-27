'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tooltip';
import type { ToneVariant, SizeVariant } from '../../theme/variants';

const pillVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold tabular-nums',
  {
    variants: {
      tone: {
        neutral: 'bg-muted/40 text-foreground',
        info: 'bg-accent/15 text-accent',
        success: 'bg-success/10 text-success-foreground',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-destructive/10 text-destructive',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  }
);

/** Map a 0-1 (or 0-100) value to the appropriate tone. */
function autoTone(value: number): ToneVariant {
  const n = value > 1 ? value / 100 : value;
  if (n > 0.8) return 'success';
  if (n > 0.6) return 'info';
  if (n > 0.3) return 'warning';
  return 'danger';
}

export type PillProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof pillVariants> & {
    /** Numeric value 0-1 or 0-100 */
    value: number;
    /** Optional text label rendered after the value */
    label?: string;
    /** Override auto-mapped tone */
    tone?: ToneVariant;
    size?: SizeVariant;
    /** Show a tooltip on hover */
    showTooltip?: boolean;
    /** Custom tooltip text (defaults to formatted value) */
    tooltipContent?: string;
  };

/** Rounded pill displaying a numeric value with auto-mapped tone. */
export function Pill({
  value,
  label,
  tone,
  size,
  showTooltip = false,
  tooltipContent,
  className,
  ...props
}: PillProps) {
  const resolvedTone = tone ?? autoTone(value);
  const display =
    value > 1 ? `${Math.round(value)}%` : `${Math.round(value * 100)}%`;

  const pill = (
    <span
      className={cn(pillVariants({ tone: resolvedTone, size }), className)}
      {...props}
    >
      {display}
      {label && <span className="font-normal">{label}</span>}
    </span>
  );

  if (!showTooltip) return pill;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{pill}</TooltipTrigger>
      <TooltipContent>{tooltipContent ?? display}</TooltipContent>
    </Tooltip>
  );
}
