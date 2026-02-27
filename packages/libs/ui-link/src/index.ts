/**
 * @module @contractspec/lib.ui-link
 * Cross-platform navigation abstraction for ContractSpec apps.
 *
 * Apps provide a RouterAdapter via RouterProvider.
 * Bundle components consume navigation through platform-agnostic
 * Link, useRouter, usePathname, and useNavigate.
 */

// Types
export type { RouterAdapter, LinkProps, RouterProviderProps } from './types';

// Provider
export { RouterProvider } from './RouterProvider';

// Context (for advanced use / adapter access)
export { useRouterAdapter } from './context';

// Components
export { Link } from './Link';

// Hooks
export { useRouter } from './hooks/useRouter';
export { usePathname } from './hooks/usePathname';
export { useNavigate } from './hooks/useNavigate';
