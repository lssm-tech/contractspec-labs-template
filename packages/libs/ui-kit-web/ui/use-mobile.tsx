import * as React from 'react';

// Must match the sidebar's `md:block` breakpoint (768px / Tailwind md).
// The Sidebar component uses `hidden md:block` for desktop rendering,
// so useIsMobile must agree on the same threshold to ensure
// toggleSidebar() dispatches to the correct path (Sheet vs. offcanvas).
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
