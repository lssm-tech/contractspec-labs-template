'use client';

import * as React from 'react';
import type { ApprovalRequest } from '@contractspec/lib.ai-agent/approval';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@contractspec/lib.ui-kit-web/ui/table';
import {
  Card,
  CardHeader,
  CardContent,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import { cn as _cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { getDesignSystemLocale } from '../../lib/utils';

const APPROVAL_QUEUE_COPY = {
  title: {
    en: 'Approvals',
    fr: 'Approbations',
    es: 'Aprobaciones',
  },
  description: {
    en: 'Requests escalated by AI agents',
    fr: 'Demandes remontees par les agents IA',
    es: 'Solicitudes escaladas por agentes de IA',
  },
  emptyState: {
    en: 'Nothing waiting for review.',
    fr: 'Aucune demande en attente de revue.',
    es: 'No hay solicitudes pendientes de revision.',
  },
  agent: {
    en: 'Agent',
    fr: 'Agent',
    es: 'Agente',
  },
  reason: {
    en: 'Reason',
    fr: 'Raison',
    es: 'Motivo',
  },
  tenant: {
    en: 'Tenant',
    fr: 'Tenant',
    es: 'Tenant',
  },
  requested: {
    en: 'Requested',
    fr: 'Demande',
    es: 'Solicitado',
  },
  status: {
    en: 'Status',
    fr: 'Statut',
    es: 'Estado',
  },
  actions: {
    en: 'Actions',
    fr: 'Actions',
    es: 'Acciones',
  },
  reject: {
    en: 'Reject',
    fr: 'Rejeter',
    es: 'Rechazar',
  },
  approve: {
    en: 'Approve',
    fr: 'Approuver',
    es: 'Aprobar',
  },
  unknownTenant: {
    en: 'Unknown',
    fr: 'Inconnu',
    es: 'Desconocido',
  },
} as const;

export interface ApprovalQueueProps {
  title?: string;
  description?: string;
  requests: ApprovalRequest[];
  onApprove?: (request: ApprovalRequest) => void;
  onReject?: (request: ApprovalRequest) => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function ApprovalQueue({
  title,
  description,
  requests,
  onApprove,
  onReject,
  className,
  emptyState,
}: ApprovalQueueProps) {
  const locale = getDesignSystemLocale();
  const resolvedTitle = title ?? APPROVAL_QUEUE_COPY.title[locale];
  const resolvedDescription =
    description ?? APPROVAL_QUEUE_COPY.description[locale];
  const resolvedEmptyState = emptyState ?? (
    <p className="text-muted-foreground">
      {APPROVAL_QUEUE_COPY.emptyState[locale]}
    </p>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{resolvedTitle}</h3>
          <p className="text-muted-foreground text-sm">{resolvedDescription}</p>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          resolvedEmptyState
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{APPROVAL_QUEUE_COPY.agent[locale]}</TableHead>
                <TableHead>{APPROVAL_QUEUE_COPY.reason[locale]}</TableHead>
                <TableHead>{APPROVAL_QUEUE_COPY.tenant[locale]}</TableHead>
                <TableHead>{APPROVAL_QUEUE_COPY.requested[locale]}</TableHead>
                <TableHead>{APPROVAL_QUEUE_COPY.status[locale]}</TableHead>
                <TableHead className="text-right">
                  {APPROVAL_QUEUE_COPY.actions[locale]}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.agentId}
                  </TableCell>
                  <TableCell className="max-w-sm truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    {request.tenantId ??
                      APPROVAL_QUEUE_COPY.unknownTenant[locale]}
                  </TableCell>
                  <TableCell>{formatRelative(request.requestedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={request.status !== 'pending'}
                        onClick={() => onReject?.(request)}
                      >
                        {APPROVAL_QUEUE_COPY.reject[locale]}
                      </Button>
                      <Button
                        size="sm"
                        disabled={request.status !== 'pending'}
                        onClick={() => onApprove?.(request)}
                      >
                        {APPROVAL_QUEUE_COPY.approve[locale]}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function badgeVariant(
  status: ApprovalRequest['status']
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function formatRelative(date: Date) {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const deltaMinutes = Math.round(
    (Date.now() - new Date(date).getTime()) / 60000
  );
  if (Math.abs(deltaMinutes) < 60) {
    return formatter.format(-deltaMinutes, 'minute');
  }
  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) {
    return formatter.format(-deltaHours, 'hour');
  }
  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(-deltaDays, 'day');
}
