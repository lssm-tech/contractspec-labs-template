export { cn } from '@contractspec/lib.ui-kit-core';

export type DesignSystemLocale = 'en' | 'fr' | 'es';

const DEFAULT_LOCALE: DesignSystemLocale = 'en';

export function resolveDesignSystemLocale(
  value?: string | null
): DesignSystemLocale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const base = value.trim().toLowerCase().split('-')[0];
  if (base === 'fr' || base === 'es' || base === 'en') {
    return base;
  }

  return DEFAULT_LOCALE;
}

export function getDesignSystemLocale(): DesignSystemLocale {
  if (typeof document !== 'undefined') {
    return resolveDesignSystemLocale(document.documentElement.lang);
  }

  if (typeof navigator !== 'undefined') {
    return resolveDesignSystemLocale(navigator.language);
  }

  return DEFAULT_LOCALE;
}
