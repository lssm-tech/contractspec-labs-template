'use client';

import * as React from 'react';
import {
  Button as WebButton,
  type ButtonProps as WebButtonProps,
} from '@contractspec/lib.ui-kit-web/ui/button';
import { Loader2 } from 'lucide-react';
// type-only import to avoid bundling RN on web
import type { PressableProps as _RNPressableProps } from 'react-native';

type SpinnerPlacement = 'start' | 'end';

export type ButtonProps = Omit<
  WebButtonProps,
  'onClick' | 'disabled' | 'children'
> & {
  // PressableBridgeProps & {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string; // ignored on web, present for API symmetry
  spinnerPlacement?: SpinnerPlacement;
  // Normalized events
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  // Web-only optional onClick for compatibility
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function Button({
  children,
  loading,
  spinnerPlacement = 'start',
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  onMouseDown,
  onMouseUp,
  onClick,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  const handleClick = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onClick?.(event);
      if (!event || !event.defaultPrevented) {
        onPress?.();
      }
    },
    [onClick, onPress]
  );

  const handleMouseDown = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onMouseDown?.(event);
      if (!event || !event.defaultPrevented) {
        onPressIn?.();
      }
    },
    [onMouseDown, onPressIn]
  );

  const handleMouseUp = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onMouseUp?.(event);
      if (!event || !event.defaultPrevented) {
        onPressOut?.();
      }
    },
    [onMouseUp, onPressOut]
  );

  const handleTouchEnd = React.useCallback<
    React.TouchEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onTouchEnd?.(event);
      if (!event || !event.defaultPrevented) {
        onPressOut?.();
      }
    },
    [onPressOut, onTouchEnd]
  );

  const handleTouchCancel = React.useCallback<
    React.TouchEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onTouchCancel?.(event);
      if (!event || !event.defaultPrevented) {
        onPressOut?.();
      }
    },
    [onPressOut, onTouchCancel]
  );

  const content = !rest.asChild ? (
    <>
      {loading && spinnerPlacement === 'start' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : null}
      {children}
      {loading && spinnerPlacement === 'end' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : null}
    </>
  ) : (
    children
  );

  return (
    <WebButton
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
      className={className}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      aria-disabled={isDisabled ? true : undefined}
      // normalized + bridged events
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type={(rest as any)?.type ?? 'button'}
    >
      {content}
    </WebButton>
  );
}
