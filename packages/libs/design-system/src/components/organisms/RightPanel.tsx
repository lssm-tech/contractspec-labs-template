'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
import { X } from 'lucide-react';

const widthVariants = cva(
  'fixed inset-y-0 right-0 z-40 flex flex-col border-l bg-background shadow-lg transition-transform duration-300',
  {
    variants: {
      width: {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[480px]',
      },
    },
    defaultVariants: { width: 'md' },
  }
);

export interface RightPanelTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export type RightPanelProps = React.HTMLAttributes<HTMLElement> & {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tabs?: RightPanelTab[];
  children?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
};

/** Fixed right panel with header, optional tabs, and scrollable content. */
export function RightPanel({
  isOpen,
  onClose,
  title,
  tabs,
  children,
  width,
  className,
  ...props
}: RightPanelProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <aside
      role="complementary"
      aria-label={title}
      className={cn(
        widthVariants({ width }),
        isOpen ? 'translate-x-0' : 'translate-x-full',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h2 className="truncate text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-muted rounded-md p-1 transition-colors"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      {tabs && tabs.length > 0 ? (
        <Tabs
          defaultValue={tabs[0]?.id ?? ''}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-2 shrink-0">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 overflow-y-auto px-4 py-3"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>
      )}
    </aside>
  );
}
