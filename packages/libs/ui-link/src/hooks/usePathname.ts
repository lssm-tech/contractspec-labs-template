'use client';

/**
 * @module @contractspec/lib.ui-link/hooks/usePathname
 * Cross-platform hook that returns the current pathname.
 */

import { useRouterAdapter } from '../context';

/**
 * Returns the current pathname string.
 *
 * @example
 * ```tsx
 * const pathname = usePathname();
 * const isActive = pathname.startsWith("/feedback");
 * ```
 */
export function usePathname(): string {
  return useRouterAdapter().pathname;
}
