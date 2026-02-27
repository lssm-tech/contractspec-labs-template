import { applyAutoCapitalizeDefaults } from './helpers';
import { deriveKindFromAutoComplete } from './key-parsing';
import type { AutoCompleteToken, KeyboardOptions } from './types';

function applyAutoCompleteDefaultsNative(
  target: Record<string, unknown>,
  autoComplete?: AutoCompleteToken
) {
  if (!autoComplete) {
    return;
  }

  const textContentMap: Partial<Record<AutoCompleteToken, string>> = {
    name: 'name',
    'given-name': 'givenName',
    'additional-name': 'middleName',
    'family-name': 'familyName',
    username: 'username',
    'current-password': 'password',
    'new-password': 'newPassword',
    email: 'emailAddress',
    url: 'URL',
    tel: 'telephoneNumber',
    'address-line1': 'streetAddressLine1',
    'address-line2': 'streetAddressLine2',
    'postal-code': 'postalCode',
    organization: 'organizationName',
    'organization-title': 'jobTitle',
    'one-time-code': 'oneTimeCode',
  };
  const textContentType = textContentMap[autoComplete];

  if (textContentType) {
    target.textContentType = textContentType;
  }

  applyAutoCapitalizeDefaults(target, autoComplete);
}

export function mapKeyboardToNative(opts?: KeyboardOptions) {
  const kind =
    opts?.kind ?? deriveKindFromAutoComplete(opts?.autoComplete) ?? 'text';
  const native: Record<string, unknown> = {};

  switch (kind) {
    case 'password':
      native.secureTextEntry = true;
      native.textContentType = 'password';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'password';
      break;
    case 'new-password':
      native.secureTextEntry = true;
      native.textContentType = 'newPassword';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'new-password';
      break;
    case 'username':
      native.textContentType = 'username';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'username';
      break;
    case 'email':
      native.keyboardType = 'email-address';
      native.textContentType = 'emailAddress';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'email';
      break;
    case 'url':
      native.keyboardType = 'url';
      native.textContentType = 'URL';
      native.autoComplete = opts?.autoComplete ?? 'url';
      break;
    case 'search':
      native.keyboardType = 'default';
      native.returnKeyType = 'search';
      native.autoComplete = opts?.autoComplete ?? 'off';
      break;
    case 'phone':
    case 'tel':
      native.keyboardType = 'phone-pad';
      native.textContentType = 'telephoneNumber';
      native.autoComplete = opts?.autoComplete ?? 'tel';
      break;
    case 'number':
    case 'int':
      native.keyboardType = 'number-pad';
      break;
    case 'decimal':
      native.keyboardType = 'decimal-pad';
      break;
    case 'numbers-and-punctuation':
      native.keyboardType = 'numbers-and-punctuation';
      break;
    case 'otp':
      native.keyboardType = 'number-pad';
      native.textContentType = 'oneTimeCode';
      native.autoComplete = opts?.autoComplete ?? 'one-time-code';
      native.autoCapitalize = 'none';
      break;
    case 'name':
      native.textContentType = 'name';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'name';
      break;
    case 'given-name':
      native.textContentType = 'givenName';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'given-name';
      break;
    case 'family-name':
      native.textContentType = 'familyName';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'family-name';
      break;
    case 'address-line1':
      native.textContentType = 'streetAddressLine1';
      native.autoComplete = opts?.autoComplete ?? 'address-line1';
      break;
    case 'address-line2':
      native.textContentType = 'streetAddressLine2';
      native.autoComplete = opts?.autoComplete ?? 'address-line2';
      break;
    case 'postal-code':
      native.keyboardType = 'numbers-and-punctuation';
      native.textContentType = 'postalCode';
      native.autoComplete = opts?.autoComplete ?? 'postal-code';
      break;
    case 'cc-number':
      native.keyboardType = 'number-pad';
      native.textContentType = 'creditCardNumber';
      native.autoComplete = opts?.autoComplete ?? 'cc-number';
      break;
    case 'cc-exp':
      native.keyboardType = 'numbers-and-punctuation';
      native.autoComplete = opts?.autoComplete ?? 'cc-exp';
      break;
    case 'cc-csc':
      native.keyboardType = 'number-pad';
      native.autoComplete = opts?.autoComplete ?? 'cc-csc';
      break;
    case 'off':
      native.autoComplete = 'off';
      break;
    case 'date':
      native.keyboardType = 'default';
      break;
    default:
      native.keyboardType = 'default';
      break;
  }

  if (opts?.autoCapitalize) native.autoCapitalize = opts.autoCapitalize;
  if (opts?.autoCorrect != null) native.autoCorrect = opts.autoCorrect;

  if (opts?.enterKeyHint) {
    const returnKeyTypeByHint: Record<string, string> = {
      enter: 'default',
      done: 'done',
      go: 'go',
      next: 'next',
      search: 'search',
      send: 'send',
    };
    native.returnKeyType = returnKeyTypeByHint[opts.enterKeyHint] ?? 'default';
  }

  applyAutoCompleteDefaultsNative(native, opts?.autoComplete);

  return native;
}
