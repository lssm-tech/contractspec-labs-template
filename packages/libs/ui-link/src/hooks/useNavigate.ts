'use client';

/**
 * @module @contractspec/lib.ui-link/hooks/useNavigate
 * Imperative navigation hook for cross-platform use.
 */

import { useCallback } from 'react';
import { useRouterAdapter } from '../context';

interface NavigateOptions {
  /** Replace the current history entry instead of pushing. */
  replace?: boolean;
}

/**
 * Returns an imperative navigate function.
 *
 * @example
 * ```tsx
 * const navigate = useNavigate();
 * navigate("/focus/abc", { replace: true });
 * ```
 */
export function useNavigate() {
  const adapter = useRouterAdapter();

  return useCallback(
    (path: string, options?: NavigateOptions) => {
      if (options?.replace) {
        adapter.replace(path);
      } else {
        adapter.push(path);
      }
    },
    [adapter]
  );
}
