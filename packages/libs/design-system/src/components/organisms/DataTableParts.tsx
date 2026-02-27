/**
 * DataTable subcomponents — sortable header and row actions menu.
 */
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import type { DataTableRowAction, SortDirection } from './DataTable';

// ── Sortable header ──

export interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection | null;
  onSort: () => void;
}

export function SortableHeader({
  label,
  active,
  direction,
  onSort,
}: SortableHeaderProps) {
  const Icon =
    active && direction === 'asc'
      ? ArrowUp
      : active && direction === 'desc'
        ? ArrowDown
        : ArrowUpDown;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 hover:underline"
      onClick={onSort}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon
        className={`h-3 w-3 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
        aria-hidden="true"
      />
    </button>
  );
}

// ── Row actions menu ──

export interface RowActionsMenuProps {
  row: Record<string, unknown>;
  actions: DataTableRowAction[];
  onAction: (row: Record<string, unknown>, action: string) => void;
}

export function RowActionsMenu({
  row,
  actions,
  onAction,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-1"
          aria-label="Row actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.action}
            onClick={() => onAction(row, a.action)}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
