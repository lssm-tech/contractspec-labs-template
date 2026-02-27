'use client';

/**
 * @module @contractspec/lib.ui-link/hooks/useRouter
 * Cross-platform router hook providing push, replace, back, and prefetch.
 */

import { useRouterAdapter } from '../context';

/**
 * Cross-platform router API.
 * Returns push, replace, back, and optional prefetch functions.
 *
 * @example
 * ```tsx
 * const router = useRouter();
 * router.push("/feedback/123");
 * router.back();
 * ```
 */
export function useRouter() {
  const adapter = useRouterAdapter();
  return {
    push: adapter.push,
    replace: adapter.replace,
    back: adapter.back,
    prefetch: adapter.prefetch,
  };
}
