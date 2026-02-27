import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { getDesignSystemLocale } from '../../../lib/utils';

const LEGAL_META_COPY = {
  version: {
    en: 'Version',
    fr: 'Version',
    es: 'Version',
  },
  lastUpdated: {
    en: 'Last updated:',
    fr: 'Derniere mise a jour :',
    es: 'Ultima actualizacion:',
  },
} as const;

export function LegalMeta({
  lastUpdated,
  version,
  className,
}: {
  lastUpdated?: string | Date;
  version?: string;
  className?: string;
}) {
  const locale = getDesignSystemLocale();

  const fmtDate = (d?: string | Date) => {
    if (!d) return null;
    try {
      const date = typeof d === 'string' ? new Date(d) : d;
      return date.toLocaleDateString();
    } catch {
      return String(d);
    }
  };
  return (
    <div className={cn('text-muted-foreground text-base', className)}>
      {version && (
        <span>
          {LEGAL_META_COPY.version[locale]} {version}
        </span>
      )}
      {version && lastUpdated && <span className="mx-2">•</span>}
      {lastUpdated && (
        <span>
          {LEGAL_META_COPY.lastUpdated[locale]} {fmtDate(lastUpdated)}
        </span>
      )}
    </div>
  );
}
