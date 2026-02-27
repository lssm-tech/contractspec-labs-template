'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { getDesignSystemLocale } from '../../lib/utils';

const AGENT_MONITOR_COPY = {
  title: {
    en: 'Agent Activity',
    fr: 'Activite des agents',
    es: 'Actividad de agentes',
  },
  emptyState: {
    en: 'No active sessions in the last hour.',
    fr: 'Aucune session active sur la derniere heure.',
    es: 'No hay sesiones activas en la ultima hora.',
  },
  global: {
    en: 'global',
    fr: 'global',
    es: 'global',
  },
  turnsUpdated: {
    en: 'turns · Updated',
    fr: 'tours · Mis a jour',
    es: 'turnos · Actualizado',
  },
} as const;

export interface AgentSessionSnapshot {
  sessionId: string;
  agent: string;
  status: string;
  tenantId?: string;
  confidence?: number;
  iterations?: number;
  updatedAt: Date;
}

export interface AgentMonitorProps {
  title?: string;
  sessions: AgentSessionSnapshot[];
  highlightStatus?: string;
  onSelectSession?: (session: AgentSessionSnapshot) => void;
  className?: string;
}

export function AgentMonitor({
  title,
  sessions,
  highlightStatus = 'escalated',
  onSelectSession,
  className,
}: AgentMonitorProps) {
  const locale = getDesignSystemLocale();
  const resolvedTitle = title ?? AGENT_MONITOR_COPY.title[locale];

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-xl font-semibold">{resolvedTitle}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {AGENT_MONITOR_COPY.emptyState[locale]}
          </p>
        ) : (
          <div className="divide-border divide-y rounded-md border">
            {sessions.map((session) => (
              <button
                key={session.sessionId}
                type="button"
                onClick={() => onSelectSession?.(session)}
                className={cn(
                  'hover:bg-muted/40 flex w-full items-center gap-4 px-4 py-3 text-left transition',
                  !onSelectSession && 'cursor-default'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {session.agent}{' '}
                    <span className="text-muted-foreground text-sm">
                      · {session.tenantId ?? AGENT_MONITOR_COPY.global[locale]}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {session.iterations ?? 0}{' '}
                    {AGENT_MONITOR_COPY.turnsUpdated[locale]}{' '}
                    {formatRelative(session.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {typeof session.confidence === 'number' && (
                    <ConfidencePill value={session.confidence} />
                  )}
                  <Badge
                    variant={
                      session.status === highlightStatus
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConfidencePill({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <div
      className={cn(
        'rounded-full px-3 py-1 text-sm font-medium',
        percent >= 75
          ? 'bg-success/15 text-success-foreground'
          : 'bg-amber-500/15 text-amber-600'
      )}
    >
      {percent}%
    </div>
  );
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
