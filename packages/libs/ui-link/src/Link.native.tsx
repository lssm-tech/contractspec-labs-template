'use client';

/**
 * @module @contractspec/lib.ui-link/Link.native
 * React Native Link variant.
 * Uses Pressable + Text for touch targets, navigates via RouterAdapter.
 */

import * as React from 'react';
import { useRouterAdapter } from './context';
import type { LinkProps } from './types';

/**
 * Native Link component using Pressable for touch interactions.
 * Falls back to a basic touchable wrapper until react-native is available.
 */
export function Link({
  href,
  children,
  className,
  replace: shouldReplace,
  'aria-label': ariaLabel,
  testID,
  onPress,
}: LinkProps) {
  const adapter = useRouterAdapter();

  const handlePress = React.useCallback(() => {
    onPress?.();

    if (shouldReplace) {
      adapter.replace(href);
    } else {
      adapter.push(href);
    }
  }, [href, shouldReplace, adapter, onPress]);

  // Dynamic import pattern: react-native may not be available
  // in all build contexts. The consuming app must ensure RN is resolvable.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pressable, Text } = require('react-native');

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={ariaLabel}
      accessibilityRole="link"
      testID={testID}
      className={className}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  );
}

export default Link;
