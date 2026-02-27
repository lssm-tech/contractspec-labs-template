'use client';

import type { ComponentProps, ElementType, Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

/* ---------- polymorphic "as" union ---------- */

type StackElement =
  | 'div'
  | 'section'
  | 'nav'
  | 'main'
  | 'header'
  | 'footer'
  | 'article'
  | 'aside';

/* ---------- VStack ---------- */

const vStackVariants = cva('flex flex-col', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

type VStackProps = ComponentProps<'div'> &
  VariantProps<typeof vStackVariants> & {
    as?: StackElement;
    ref?: Ref<HTMLDivElement>;
  };

function VStack({
  className,
  gap,
  align,
  justify,
  as = 'div',
  ref,
  ...props
}: VStackProps) {
  const Comp: ElementType = as;
  return (
    <Comp
      ref={ref}
      className={cn(vStackVariants({ gap, align, justify }), className)}
      {...props}
    />
  );
}

/* ---------- HStack ---------- */

const hStackVariants = cva('flex flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrapReverse: 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  },
});

type HStackProps = ComponentProps<'div'> &
  VariantProps<typeof hStackVariants> & {
    as?: StackElement;
    ref?: Ref<HTMLDivElement>;
  };

function HStack({
  className,
  gap,
  align,
  justify,
  wrap,
  as = 'div',
  ref,
  ...props
}: HStackProps) {
  const Comp: ElementType = as;
  return (
    <Comp
      ref={ref}
      className={cn(hStackVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}

/* ---------- Box ---------- */

const boxVariants = cva('flex flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrapReverse: 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'center',
    wrap: 'nowrap',
  },
});

type BoxProps = ComponentProps<'div'> &
  VariantProps<typeof boxVariants> & {
    as?: StackElement;
    ref?: Ref<HTMLDivElement>;
  };

function Box({
  className,
  gap,
  align,
  justify,
  wrap,
  as = 'div',
  ref,
  ...props
}: BoxProps) {
  const Comp: ElementType = as;
  return (
    <Comp
      ref={ref}
      className={cn(boxVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}

export { VStack, HStack, vStackVariants, hStackVariants, boxVariants, Box };
