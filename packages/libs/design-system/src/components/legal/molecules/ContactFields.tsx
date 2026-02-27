import * as React from 'react';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import { getDesignSystemLocale } from '../../../lib/utils';

const CONTACT_FIELDS_COPY = {
  name: {
    en: 'Name',
    fr: 'Nom',
    es: 'Nombre',
  },
  email: {
    en: 'Email',
    fr: 'Email',
    es: 'Correo',
  },
  subject: {
    en: 'Subject',
    fr: 'Objet',
    es: 'Asunto',
  },
  message: {
    en: 'Message',
    fr: 'Message',
    es: 'Mensaje',
  },
} as const;

export function ContactFields({
  value,
  onChange,
  disabled,
}: {
  value: { name: string; email: string; subject: string; message: string };
  onChange: (next: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
  disabled?: boolean;
}) {
  const locale = getDesignSystemLocale();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{CONTACT_FIELDS_COPY.name[locale]}</Label>
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>{CONTACT_FIELDS_COPY.email[locale]}</Label>
        <Input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>{CONTACT_FIELDS_COPY.subject[locale]}</Label>
        <Input
          value={value.subject}
          onChange={(e) =>
            onChange({
              ...value,
              subject: e.target.value,
            })
          }
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>{CONTACT_FIELDS_COPY.message[locale]}</Label>
        <Textarea
          value={value.message}
          onChange={(e) =>
            onChange({
              ...value,
              message: e.target.value,
            })
          }
          disabled={disabled}
          rows={6}
        />
      </div>
    </div>
  );
}
