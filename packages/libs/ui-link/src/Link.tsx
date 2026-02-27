'use client';

/**
 * @module @contractspec/lib.ui-link/Link
 * Base cross-platform Link component.
 *
 * Uses the RouterAdapter from context for navigation.
 * Platform-specific variants (Link.web.tsx / Link.native.tsx)
 * are resolved at build time by the bundler (Webpack/Metro).
 */

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-core';
import { useRouterAdapter } from './context';
import type { LinkProps } from './types';

/**
 * Cross-platform Link component.
 * Renders as `<a>` on web, navigates via RouterAdapter.
 */
export function Link({
  href,
  children,
  className,
  replace: shouldReplace,
  prefetch,
  'aria-label': ariaLabel,
  testID,
  onClick,
  onPress,
}: LinkProps) {
  const adapter = useRouterAdapter();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);

      // Allow cmd/ctrl+click to open in new tab
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // External URLs: let the browser handle
      if (href.startsWith('http://') || href.startsWith('https://')) return;

      if (e.defaultPrevented) return;

      e.preventDefault();
      onPress?.();

      if (shouldReplace) {
        adapter.replace(href);
      } else {
        adapter.push(href);
      }
    },
    [href, shouldReplace, adapter, onPress, onClick]
  );

  React.useEffect(() => {
    if (prefetch && adapter.prefetch) {
      adapter.prefetch(href);
    }
  }, [prefetch, href, adapter]);

  return (
    <a
      href={href}
      className={cn(className)}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-testid={testID}
    >
      {children}
    </a>
  );
}

export default Link;
