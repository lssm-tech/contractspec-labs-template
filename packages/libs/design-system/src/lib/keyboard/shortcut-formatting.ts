export type ShortcutPlatform = 'mac' | 'windows' | 'linux';
export type ShortcutModifier = 'meta' | 'ctrl' | 'alt' | 'shift';

export interface ShortcutDescriptor {
  modifiers: ShortcutModifier[];
  key: string;
}

const modifierOrder: ShortcutModifier[] = ['meta', 'ctrl', 'alt', 'shift'];

const modifierLabels: Record<
  ShortcutPlatform,
  Record<ShortcutModifier, string>
> = {
  mac: {
    meta: 'Cmd',
    ctrl: 'Ctrl',
    alt: 'Option',
    shift: 'Shift',
  },
  windows: {
    meta: 'Win',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
  },
  linux: {
    meta: 'Super',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
  },
};

function normalizeModifier(token: string): ShortcutModifier | undefined {
  switch (token.toLowerCase()) {
    case 'meta':
    case 'cmd':
    case 'command':
      return 'meta';
    case 'control':
    case 'ctrl':
      return 'ctrl';
    case 'option':
    case 'alt':
      return 'alt';
    case 'shift':
      return 'shift';
    default:
      return undefined;
  }
}

export function parseShortcut(combo: string): ShortcutDescriptor {
  const tokens = combo
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean);

  const key = tokens.pop() ?? '';
  const modifiers = tokens
    .map(normalizeModifier)
    .filter((value): value is ShortcutModifier => value != null)
    .sort((a, b) => modifierOrder.indexOf(a) - modifierOrder.indexOf(b));

  return { modifiers, key };
}

export function formatShortcut(
  shortcut: ShortcutDescriptor,
  platform: ShortcutPlatform
): string {
  const labels = shortcut.modifiers.map(
    (modifier) => modifierLabels[platform]?.[modifier] ?? modifier
  );
  const keyLabel =
    shortcut.key.length > 1
      ? shortcut.key.charAt(0).toUpperCase() +
        shortcut.key.slice(1).toLowerCase()
      : shortcut.key.toUpperCase();

  return [...labels, keyLabel].filter(Boolean).join(' + ');
}
