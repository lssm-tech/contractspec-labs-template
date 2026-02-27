'use client';

/**
 * @module @contractspec/lib.ui-link/context
 * RouterProvider and context for cross-platform navigation.
 *
 * Apps wrap their root layout with RouterProvider, injecting
 * a platform-specific RouterAdapter. All bundle components then
 * consume navigation via useRouter / usePathname / useNavigate
 * without knowing which platform they run on.
 */

import { createContext, useContext } from 'react';
import type { RouterAdapter } from './types';

/**
 * Fallback adapter that warns in development when RouterProvider
 * is missing. Prevents hard crashes in unit tests or storybook.
 */
const fallbackAdapter: RouterAdapter = {
  push(_path: string) {
    /* no-op: RouterProvider not yet mounted */
  },
  replace(_path: string) {
    /* no-op: RouterProvider not yet mounted */
  },
  back() {
    /* no-op: RouterProvider not yet mounted */
  },
  pathname: '/',
};

/**
 * React context holding the platform-specific router adapter.
 * @internal
 */
export const RouterContext = createContext<RouterAdapter>(fallbackAdapter);

/**
 * Access the full RouterAdapter from context.
 * Provides push, replace, back, pathname, and optional prefetch.
 */
export function useRouterAdapter(): RouterAdapter {
  return useContext(RouterContext);
}
