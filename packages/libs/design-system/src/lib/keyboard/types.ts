export type KeyboardKind =
  | 'text'
  | 'email'
  | 'password'
  | 'new-password'
  | 'username'
  | 'url'
  | 'search'
  | 'phone'
  | 'tel' // alias of phone
  | 'number'
  | 'int' // alias of number
  | 'decimal'
  | 'numbers-and-punctuation'
  | 'otp'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'address-line1'
  | 'address-line2'
  | 'postal-code'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-csc'
  | 'off'
  | 'date';

// WHATWG HTML autofill tokens (subset + extensible). See:
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
export type AutoCompleteToken =
  | 'on'
  | 'off'
  // identity
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  // organization
  | 'organization-title'
  | 'organization'
  // address
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  // credit card / payment
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-amount'
  // personal
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'photo'
  // contact
  | 'email'
  | 'impp'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-local-prefix'
  | 'tel-local-suffix'
  | 'tel-extension'
  | 'url'
  // webauthn and sections (allow prefix)
  | 'webauthn'
  | `section-${string}`
  // allow future spec additions while keeping strong hints
  | (string & {});

export type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'search' | 'send';

export interface KeyboardOptions {
  kind?: KeyboardKind;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: AutoCompleteToken;
  autoCorrect?: boolean;
  enterKeyHint?: EnterKeyHint;
}
