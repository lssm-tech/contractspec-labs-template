import * as React from 'react';
import { Button } from '../../atoms/Button';
import { LegalSection } from '../atoms/LegalSection';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalText } from '../atoms/LegalText';
import { getDesignSystemLocale } from '../../../lib/utils';

const GDPR_DATA_REQUEST_COPY = {
  export: {
    en: 'Request a copy',
    fr: 'Demander une copie',
    es: 'Solicitar una copia',
  },
  delete: {
    en: 'Request deletion',
    fr: 'Demander la suppression',
    es: 'Solicitar eliminacion',
  },
  heading: {
    en: 'Data requests',
    fr: 'Demandes de donnees',
    es: 'Solicitudes de datos',
  },
  body: {
    en: 'You can request a copy of your data or ask for deletion. These requests require identity verification and are processed within legal deadlines.',
    fr: 'Vous pouvez demander une copie de vos donnees ou solliciter leur suppression. Ces demandes necessitent une verification d identite et sont traitees dans les delais legaux.',
    es: 'Puedes solicitar una copia de tus datos o pedir su eliminacion. Estas solicitudes requieren verificacion de identidad y se procesan dentro de los plazos legales.',
  },
  sending: {
    en: 'Sending...',
    fr: 'Envoi...',
    es: 'Enviando...',
  },
} as const;

export function GDPRDataRequest({
  onExport,
  onDelete,
  labels,
}: {
  onExport?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  labels?: { export: React.ReactNode; delete: React.ReactNode };
}) {
  const locale = getDesignSystemLocale();
  const resolvedLabels = labels ?? {
    export: GDPR_DATA_REQUEST_COPY.export[locale],
    delete: GDPR_DATA_REQUEST_COPY.delete[locale],
  };

  const [loading, setLoading] = React.useState<'export' | 'delete' | null>(
    null
  );

  const handle = async (kind: 'export' | 'delete') => {
    const fn = kind === 'export' ? onExport : onDelete;
    if (!fn) return;
    setLoading(kind);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  };

  return (
    <LegalSection border="top" className="space-y-3">
      <LegalHeading as="h2" level="h2">
        {GDPR_DATA_REQUEST_COPY.heading[locale]}
      </LegalHeading>
      <LegalText>{GDPR_DATA_REQUEST_COPY.body[locale]}</LegalText>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => handle('export')} disabled={loading !== null}>
          {loading === 'export'
            ? GDPR_DATA_REQUEST_COPY.sending[locale]
            : resolvedLabels.export}
        </Button>
        <Button
          variant="destructive"
          onPress={() => handle('delete')}
          disabled={loading !== null}
        >
          {loading === 'delete'
            ? GDPR_DATA_REQUEST_COPY.sending[locale]
            : resolvedLabels.delete}
        </Button>
      </div>
    </LegalSection>
  );
}
