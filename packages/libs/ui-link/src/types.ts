/**
 * @module @contractspec/lib.ui-link/types
 * Cross-platform navigation types for the ui-link package.
 *
 * RouterAdapter is implemented per-platform (Next.js, Expo Router, etc.)
 * and injected via RouterProvider context.
 */

import type { MouseEvent, ReactNode } from 'react';

/**
 * Platform-agnostic router adapter interface.
 * Each app platform provides its own implementation.
 */
export interface RouterAdapter {
  /** Navigate to a new path, pushing onto history stack. */
  push(path: string): void;
  /** Navigate to a new path, replacing the current history entry. */
  replace(path: string): void;
  /** Go back one entry in the history stack. */
  back(): void;
  /** The current pathname (e.g. "/feedback/123"). */
  pathname: string;
  /** Optional: prefetch a route for faster navigation. */
  prefetch?(path: string): void;
}

/**
 * Props for the cross-platform Link component.
 * Supports both web anchor semantics and native pressable behavior.
 */
export interface LinkProps {
  /** The destination path or URL. */
  href: string;
  /** Content to render inside the link. */
  children: ReactNode;
  /** Optional CSS class (web) or style override key. */
  className?: string;
  /** Replace current history entry instead of pushing. */
  replace?: boolean;
  /** Prefetch the linked route on mount/hover. */
  prefetch?: boolean;
  /** Accessible label for screen readers. */
  'aria-label'?: string;
  /** Additional test ID for testing frameworks. */
  testID?: string;
  /** Callback fired when the link is clicked. */
  onClick?(event: MouseEvent<HTMLAnchorElement>): void;
  /** Callback fired when the link is pressed. */
  onPress?(): void;
}

/**
 * Props for the RouterProvider component.
 */
export interface RouterProviderProps {
  /** The platform-specific router adapter. */
  adapter: RouterAdapter;
  /** Child components that consume the router context. */
  children: ReactNode;
}
