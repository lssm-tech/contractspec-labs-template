import { applyAutoCapitalizeDefaults } from './helpers';
import { deriveKindFromAutoComplete } from './key-parsing';
import type { AutoCompleteToken, KeyboardOptions } from './types';

function applyAutoCompleteDefaultsWeb(
  target: Record<string, unknown>,
  autoComplete?: AutoCompleteToken
) {
  if (!autoComplete) {
    return;
  }

  applyAutoCapitalizeDefaults(target, autoComplete);
}

export function mapKeyboardToWeb(opts?: KeyboardOptions) {
  const kind =
    opts?.kind ?? deriveKindFromAutoComplete(opts?.autoComplete) ?? 'text';
  const result: Record<string, unknown> = {};

  switch (kind) {
    case 'password':
      result.type = 'password';
      result.autoCapitalize = 'none';
      result.autoComplete = opts?.autoComplete ?? 'current-password';
      if (opts?.autoCorrect != null) result.autoCorrect = opts.autoCorrect;
      break;
    case 'new-password':
      result.type = 'password';
      result.autoCapitalize = 'none';
      result.autoComplete = opts?.autoComplete ?? 'new-password';
      if (opts?.autoCorrect != null) result.autoCorrect = opts.autoCorrect;
      break;
    case 'username':
      result.type = 'text';
      result.autoCapitalize = 'none';
      result.autoComplete = opts?.autoComplete ?? 'username';
      break;
    case 'email':
      result.type = 'email';
      result.inputMode = 'email';
      result.autoCapitalize = 'none';
      result.autoComplete = opts?.autoComplete ?? 'email';
      break;
    case 'url':
      result.type = 'url';
      result.inputMode = 'url';
      result.autoComplete = opts?.autoComplete ?? 'url';
      break;
    case 'search':
      result.type = 'search';
      result.inputMode = 'search';
      result.enterKeyHint = opts?.enterKeyHint ?? 'search';
      result.autoComplete = opts?.autoComplete ?? 'off';
      break;
    case 'phone':
    case 'tel':
      result.type = 'tel';
      result.inputMode = 'tel';
      result.autoComplete = opts?.autoComplete ?? 'tel';
      break;
    case 'number':
    case 'int':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.pattern = '[0-9]*';
      break;
    case 'decimal':
      result.type = 'text';
      result.inputMode = 'decimal';
      result.step = 'any';
      break;
    case 'numbers-and-punctuation':
      result.type = 'text';
      result.inputMode = 'text';
      result.pattern = '[0-9.,-]*';
      break;
    case 'otp':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.autoComplete = opts?.autoComplete ?? 'one-time-code';
      result.autoCapitalize = 'none';
      break;
    case 'name':
      result.type = 'text';
      result.autoComplete = opts?.autoComplete ?? 'name';
      result.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'given-name':
      result.type = 'text';
      result.autoComplete = opts?.autoComplete ?? 'given-name';
      result.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'family-name':
      result.type = 'text';
      result.autoComplete = opts?.autoComplete ?? 'family-name';
      result.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'address-line1':
      result.type = 'text';
      result.autoComplete = opts?.autoComplete ?? 'address-line1';
      break;
    case 'address-line2':
      result.type = 'text';
      result.autoComplete = opts?.autoComplete ?? 'address-line2';
      break;
    case 'postal-code':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.pattern = '[0-9]*';
      result.autoComplete = opts?.autoComplete ?? 'postal-code';
      break;
    case 'cc-number':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.pattern = '[0-9]*';
      result.autoComplete = opts?.autoComplete ?? 'cc-number';
      break;
    case 'cc-exp':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.pattern = '[0-9/]*';
      result.autoComplete = opts?.autoComplete ?? 'cc-exp';
      break;
    case 'cc-csc':
      result.type = 'text';
      result.inputMode = 'numeric';
      result.pattern = '[0-9]*';
      result.autoComplete = opts?.autoComplete ?? 'cc-csc';
      break;
    case 'off':
      result.type = 'text';
      result.autoComplete = 'off';
      break;
    case 'date':
      result.type = 'date';
      result.inputMode = 'date';
      result.pattern = '[0-9./-]*';
      break;
    default:
      result.type = 'text';
      break;
  }

  if (opts?.autoCapitalize) result.autoCapitalize = opts.autoCapitalize;
  if (opts?.autoComplete) result.autoComplete = opts.autoComplete;
  if (opts?.autoCorrect != null) result.autoCorrect = opts.autoCorrect;
  if (opts?.enterKeyHint) result.enterKeyHint = opts.enterKeyHint;
  applyAutoCompleteDefaultsWeb(result, opts?.autoComplete);

  return result;
}
