import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn, getUiLocale } from './utils';
import { type ButtonProps, buttonVariants } from './button';

const PAGINATION_COPY = {
  previous: {
    en: 'Previous',
    fr: 'Precedent',
    es: 'Anterior',
  },
  next: {
    en: 'Next',
    fr: 'Suivant',
    es: 'Siguiente',
  },
  previousAria: {
    en: 'Go to previous page',
    fr: 'Aller a la page precedente',
    es: 'Ir a la pagina anterior',
  },
  nextAria: {
    en: 'Go to next page',
    fr: 'Aller a la page suivante',
    es: 'Ir a la pagina siguiente',
  },
  morePages: {
    en: 'More pages',
    fr: 'Plus de pages',
    es: 'Mas paginas',
  },
} as const;

const Pagination = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentPropsWithoutRef<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const locale = getUiLocale();

  return (
    <PaginationLink
      aria-label={PAGINATION_COPY.previousAria[locale]}
      size="default"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{PAGINATION_COPY.previous[locale]}</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const locale = getUiLocale();

  return (
    <PaginationLink
      aria-label={PAGINATION_COPY.nextAria[locale]}
      size="default"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>{PAGINATION_COPY.next[locale]}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  const locale = getUiLocale();

  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{PAGINATION_COPY.morePages[locale]}</span>
    </span>
  );
};
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
