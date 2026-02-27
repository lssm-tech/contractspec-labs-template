'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNum: number;
}

/** Compute a simple line-level diff. */
export function computeDiff(before: string, after: string): DiffLine[] {
  const oldLines = before.split('\n');
  const newLines = after.split('\n');
  const result: DiffLine[] = [];
  const max = Math.max(oldLines.length, newLines.length);
  let lineNum = 1;

  for (let i = 0; i < max; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    if (oldLine === newLine) {
      result.push({
        type: 'unchanged',
        content: oldLine ?? '',
        lineNum: lineNum++,
      });
    } else {
      if (oldLine != null) {
        result.push({ type: 'removed', content: oldLine, lineNum: lineNum++ });
      }
      if (newLine != null) {
        result.push({ type: 'added', content: newLine, lineNum: lineNum++ });
      }
    }
  }
  return result;
}

const lineStyles: Record<DiffLine['type'], string> = {
  added: 'bg-success/10 text-success-foreground',
  removed: 'bg-destructive/10 text-destructive line-through',
  unchanged: '',
};

export function InlineView({ lines }: { lines: DiffLine[] }) {
  return (
    <pre className="text-xs leading-6">
      {lines.map((line, i) => (
        <div key={i} className={cn('flex', lineStyles[line.type])}>
          <span className="text-muted-foreground w-10 shrink-0 pr-2 text-right select-none">
            {line.lineNum}
          </span>
          <span className="w-5 shrink-0 text-center select-none">
            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          </span>
          <span className="flex-1 pr-4 whitespace-pre-wrap">
            {line.content}
          </span>
        </div>
      ))}
    </pre>
  );
}

export function SideBySideView({ lines }: { lines: DiffLine[] }) {
  const removed = lines.filter((l) => l.type !== 'added');
  const added = lines.filter((l) => l.type !== 'removed');

  return (
    <div className="grid grid-cols-2 divide-x text-xs leading-6">
      <pre>
        {removed.map((line, i) => (
          <div key={i} className={cn('flex px-2', lineStyles[line.type])}>
            <span className="text-muted-foreground w-8 shrink-0 pr-2 text-right select-none">
              {line.lineNum}
            </span>
            <span className="flex-1 whitespace-pre-wrap">{line.content}</span>
          </div>
        ))}
      </pre>
      <pre>
        {added.map((line, i) => (
          <div key={i} className={cn('flex px-2', lineStyles[line.type])}>
            <span className="text-muted-foreground w-8 shrink-0 pr-2 text-right select-none">
              {line.lineNum}
            </span>
            <span className="flex-1 whitespace-pre-wrap">{line.content}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
