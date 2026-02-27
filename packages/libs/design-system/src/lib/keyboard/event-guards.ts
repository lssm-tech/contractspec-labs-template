import { parseShortcut } from './shortcut-formatting';

export interface KeyboardEventLike {
  key?: string;
  code?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  repeat?: boolean;
  target?: {
    isContentEditable?: boolean;
    tagName?: string;
  } | null;
}

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function isTypingTarget(event: KeyboardEventLike): boolean {
  if (!event.target) {
    return false;
  }

  if (event.target.isContentEditable) {
    return true;
  }

  return EDITABLE_TAGS.has((event.target.tagName ?? '').toUpperCase());
}

export function isModifierOnlyEvent(event: KeyboardEventLike): boolean {
  const key = (event.key ?? '').toLowerCase();

  return (
    key === 'meta' ||
    key === 'control' ||
    key === 'ctrl' ||
    key === 'alt' ||
    key === 'shift'
  );
}

export function matchesShortcut(
  event: KeyboardEventLike,
  shortcut: string
): boolean {
  const parsed = parseShortcut(shortcut);
  const key = (event.key ?? '').toLowerCase();
  const normalizedTargetKey = parsed.key.toLowerCase();

  const needsMeta = parsed.modifiers.includes('meta');
  const needsCtrl = parsed.modifiers.includes('ctrl');
  const needsAlt = parsed.modifiers.includes('alt');
  const needsShift = parsed.modifiers.includes('shift');

  return (
    key === normalizedTargetKey &&
    Boolean(event.metaKey) === needsMeta &&
    Boolean(event.ctrlKey) === needsCtrl &&
    Boolean(event.altKey) === needsAlt &&
    Boolean(event.shiftKey) === needsShift
  );
}
