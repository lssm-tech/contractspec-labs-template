import type { AutoCompleteToken, KeyboardKind } from './types';

export function deriveKindFromAutoComplete(
  autoComplete?: AutoCompleteToken
): KeyboardKind | undefined {
  if (!autoComplete) {
    return undefined;
  }

  switch (autoComplete) {
    // Direct mappings
    case 'email':
      return 'email';
    case 'url':
      return 'url';
    case 'username':
      return 'username';
    case 'new-password':
      return 'new-password';
    case 'current-password':
      return 'password';
    case 'one-time-code':
      return 'otp';
    case 'tel':
    case 'tel-country-code':
    case 'tel-national':
    case 'tel-area-code':
    case 'tel-local':
    case 'tel-local-prefix':
    case 'tel-local-suffix':
    case 'tel-extension':
      return 'tel';
    // Numeric leaning
    case 'postal-code':
    case 'cc-number':
    case 'cc-csc':
    case 'bday-day':
    case 'bday-month':
    case 'bday-year':
      return 'int';
    case 'cc-exp':
    case 'cc-exp-month':
    case 'cc-exp-year':
      return 'numbers-and-punctuation';
    // Date-like
    case 'bday':
      return 'date';
    // Everything else is plain text (names, organization, street-address, etc.)
    default:
      return 'text';
  }
}
