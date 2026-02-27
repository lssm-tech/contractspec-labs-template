import type { AutoCompleteToken } from './types';

export const WORDS_CAPS_TOKENS: AutoCompleteToken[] = [
  'name',
  'given-name',
  'additional-name',
  'family-name',
  'honorific-prefix',
  'honorific-suffix',
  'nickname',
  'organization',
  'organization-title',
  'cc-name',
  'cc-given-name',
  'cc-additional-name',
  'cc-family-name',
];

export const NONE_CAPS_TOKENS: AutoCompleteToken[] = [
  'username',
  'new-password',
  'current-password',
  'one-time-code',
  'email',
  'url',
];

export function applyAutoCapitalizeDefaults(
  target: Record<string, unknown>,
  autoComplete?: AutoCompleteToken
) {
  if (!autoComplete) {
    return;
  }

  if (WORDS_CAPS_TOKENS.includes(autoComplete)) {
    target.autoCapitalize = 'words';
  }

  if (NONE_CAPS_TOKENS.includes(autoComplete)) {
    target.autoCapitalize = 'none';
  }
}
