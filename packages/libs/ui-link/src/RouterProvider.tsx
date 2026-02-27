'use client';

/**
 * @module @contractspec/lib.ui-link/RouterProvider
 * Wraps the application tree with a platform-specific RouterAdapter.
 */

import * as React from 'react';
import { RouterContext } from './context';
import type { RouterProviderProps } from './types';

/**
 * Provides cross-platform navigation context to all descendant components.
 *
 * @example Next.js app layout
 * ```tsx
 * import { RouterProvider } from "@contractspec/lib.ui-link";
 * import { useNextRouterAdapter } from "../lib/router-adapter";
 *
 * export default function Layout({ children }) {
 *   const adapter = useNextRouterAdapter();
 *   return <RouterProvider adapter={adapter}>{children}</RouterProvider>;
 * }
 * ```
 */
export function RouterProvider({ adapter, children }: RouterProviderProps) {
  return (
    <RouterContext.Provider value={adapter}>{children}</RouterContext.Provider>
  );
}
