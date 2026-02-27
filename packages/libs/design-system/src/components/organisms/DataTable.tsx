/**
 * DataTable — enhanced table organism built on ui-kit-web Table primitives.
 *
 * Supports column sorting, filter slots, row actions, bulk selection,
 * and empty state rendering.
 */
'use client';

import type * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@contractspec/lib.ui-kit-web/ui/table';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { SortableHeader, RowActionsMenu } from './DataTableParts';

// ── Types ──

export interface DataTableColumn {
  id: string;
  header: string;
  accessorKey: string;
  sortable?: boolean;
  className?: string;
  cell?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface DataTableRowAction {
  label: string;
  action: string;
}
export type SortDirection = 'asc' | 'desc';

export interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, unknown>[];
  onSort?: (col: string, dir: SortDirection) => void;
  onRowAction?: (row: Record<string, unknown>, action: string) => void;
  rowActions?: DataTableRowAction[];
  emptyState?: React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  rowIdKey?: string;
  filterSlot?: React.ReactNode;
  className?: string;
}

// ── Component ──

/** Enhanced data table with sorting, selection, and row actions. */
export function DataTable({
  columns,
  data,
  onSort,
  onRowAction,
  rowActions,
  emptyState,
  selectable = false,
  onSelectionChange,
  rowIdKey = 'id',
  filterSlot,
  className,
}: DataTableProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = useCallback(
    (colId: string) => {
      const newDir: SortDirection =
        sortCol === colId && sortDir === 'asc' ? 'desc' : 'asc';
      setSortCol(colId);
      setSortDir(newDir);
      onSort?.(colId, newDir);
    },
    [sortCol, sortDir, onSort]
  );

  const allIds = useMemo(
    () => data.map((row) => String(row[rowIdKey] ?? '')),
    [data, rowIdKey]
  );

  const toggleRow = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        onSelectionChange?.([...next]);
        return next;
      });
    },
    [onSelectionChange]
  );

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next =
        prev.size === allIds.length ? new Set<string>() : new Set(allIds);
      onSelectionChange?.([...next]);
      return next;
    });
  }, [allIds, onSelectionChange]);

  const hasActions = rowActions && rowActions.length > 0 && onRowAction;

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      {filterSlot ? <div className="mb-3">{filterSlot}</div> : null}

      <Table>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    selectedIds.size === allIds.length && allIds.length > 0
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            ) : null}
            {columns.map((col) => (
              <TableHead key={col.id} className={col.className}>
                {col.sortable ? (
                  <SortableHeader
                    label={col.header}
                    active={sortCol === col.id}
                    direction={sortCol === col.id ? sortDir : null}
                    onSort={() => handleSort(col.id)}
                  />
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
            {hasActions ? <TableHead className="w-12" /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIdx) => {
            const rowId = String(row[rowIdKey] ?? rowIdx);
            return (
              <TableRow key={rowId}>
                {selectable ? (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(rowId)}
                      onCheckedChange={() => toggleRow(rowId)}
                      aria-label={`Select row ${rowId}`}
                    />
                  </TableCell>
                ) : null}
                {columns.map((col) => (
                  <TableCell key={col.id} className={col.className}>
                    {col.cell
                      ? col.cell(row[col.accessorKey], row)
                      : String(row[col.accessorKey] ?? '')}
                  </TableCell>
                ))}
                {hasActions && rowActions && onRowAction ? (
                  <TableCell>
                    <RowActionsMenu
                      row={row}
                      actions={rowActions}
                      onAction={onRowAction}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
