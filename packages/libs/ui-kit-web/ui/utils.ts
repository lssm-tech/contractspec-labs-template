export { cn } from '@contractspec/lib.ui-kit-core';

export type UiLocale = 'en' | 'fr' | 'es';

const UI_DEFAULT_LOCALE: UiLocale = 'en';

export function resolveUiLocale(value?: string | null): UiLocale {
  if (!value) {
    return UI_DEFAULT_LOCALE;
  }

  const base = value.trim().toLowerCase().split('-')[0];
  if (base === 'fr' || base === 'es' || base === 'en') {
    return base;
  }

  return UI_DEFAULT_LOCALE;
}

export function getUiLocale(): UiLocale {
  if (typeof document !== 'undefined') {
    return resolveUiLocale(document.documentElement.lang);
  }

  if (typeof navigator !== 'undefined') {
    return resolveUiLocale(navigator.language);
  }

  return UI_DEFAULT_LOCALE;
}
