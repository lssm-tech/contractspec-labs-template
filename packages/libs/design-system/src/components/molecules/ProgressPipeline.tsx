'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

export type PipelineStepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface PipelineStep {
  id: string;
  label: string;
  status: PipelineStepStatus;
  count?: number;
}

const dotVariants = cva(
  'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
  {
    variants: {
      status: {
        pending: 'border-muted-foreground/30 bg-background',
        active: 'border-primary bg-primary/10 animate-pulse',
        completed: 'border-success-foreground bg-success/10',
        error: 'border-destructive bg-destructive/10',
      },
    },
    defaultVariants: { status: 'pending' },
  }
);

const lineVariants = cva('h-0.5 flex-1 transition-colors', {
  variants: {
    filled: {
      true: 'bg-success-foreground/50',
      false: 'bg-muted-foreground/20',
    },
  },
  defaultVariants: { filled: false },
});

export type ProgressPipelineProps = React.HTMLAttributes<HTMLDivElement> & {
  steps: PipelineStep[];
};

/** Horizontal pipeline with connected dots, labels, and status colors. */
export function ProgressPipeline({
  steps,
  className,
  ...props
}: ProgressPipelineProps) {
  return (
    <div
      className={cn('flex items-start gap-0', className)}
      role="list"
      aria-label="Progress pipeline"
      {...props}
    >
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const lineFilled =
          step.status === 'completed' || step.status === 'error';

        return (
          <div
            key={step.id}
            role="listitem"
            className={cn('flex flex-col items-center', !isLast && 'flex-1')}
          >
            {/* Dot + connector line row */}
            <div className="flex w-full items-center">
              <span className={dotVariants({ status: step.status })}>
                {step.status === 'completed' && (
                  <Check className="text-success-foreground h-3.5 w-3.5" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="text-destructive h-3.5 w-3.5" />
                )}
                {step.status === 'active' && (
                  <span className="bg-primary h-2 w-2 rounded-full" />
                )}
              </span>
              {!isLast && (
                <span className={lineVariants({ filled: lineFilled })} />
              )}
            </div>

            {/* Label + optional count */}
            <span className="text-muted-foreground mt-1.5 max-w-[5rem] text-center text-xs leading-tight">
              {step.label}
            </span>
            {step.count != null && (
              <Badge variant="secondary" className="mt-1 text-[10px]">
                {step.count}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
