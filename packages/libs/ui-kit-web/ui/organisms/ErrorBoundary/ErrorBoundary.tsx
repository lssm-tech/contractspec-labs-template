'use client';

import React from 'react';
// import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../button';
import { getUiLocale } from '../../utils';

const ERROR_BOUNDARY_COPY = {
  title: {
    en: 'Something went wrong',
    fr: "Une erreur s'est produite",
    es: 'Se produjo un error',
  },
  description: {
    en: 'We apologize for the inconvenience. Our team has been notified and is working on a fix.',
    fr: 'Nous nous excusons pour ce desagrement. Notre equipe a ete notifiee et travaille a resoudre le probleme.',
    es: 'Lamentamos las molestias. Nuestro equipo ha sido notificado y esta trabajando en una solucion.',
  },
  developmentError: {
    en: 'Development error:',
    fr: 'Erreur de developpement :',
    es: 'Error de desarrollo:',
  },
  idPrefix: {
    en: 'ID:',
    fr: 'ID :',
    es: 'ID:',
  },
  retry: {
    en: 'Retry',
    fr: 'Reessayer',
    es: 'Reintentar',
  },
  home: {
    en: 'Home',
    fr: 'Accueil',
    es: 'Inicio',
  },
  errorCode: {
    en: 'Error code:',
    fr: "Code d'erreur :",
    es: 'Codigo de error:',
  },
} as const;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  errorId: string | null;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  resetError,
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const locale = getUiLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          {ERROR_BOUNDARY_COPY.title[locale]}
        </h1>

        <p className="mb-6 text-gray-600">
          {ERROR_BOUNDARY_COPY.description[locale]}
        </p>

        {isDevelopment && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-left">
            <p className="mb-2 text-base font-medium text-red-800">
              {ERROR_BOUNDARY_COPY.developmentError[locale]}
            </p>
            <p className="font-mono text-sm break-all text-red-700">
              {error.message}
            </p>
            {errorId && (
              <p className="mt-2 text-sm text-red-600">
                {ERROR_BOUNDARY_COPY.idPrefix[locale]} {errorId}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={resetError} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {ERROR_BOUNDARY_COPY.retry[locale]}
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {ERROR_BOUNDARY_COPY.home[locale]}
          </Button>
        </div>

        {!isDevelopment && errorId && (
          <p className="mt-4 text-sm text-gray-500">
            {ERROR_BOUNDARY_COPY.errorCode[locale]} {errorId}
          </p>
        )}
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log to Sentry with additional context
    // Sentry.withScope((scope) => {
    //   scope.setTag('errorBoundary', true);
    //   scope.setContext('errorInfo', { ...errorInfo });
    //   scope.setContext('errorId', { errorId });
    //   Sentry.captureException(error);
    // });

    // Update state with error ID
    this.setState({ errorId });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  return React.useCallback((error: Error) => {
    // This will be caught by the nearest error boundary
    throw error;
  }, []);
};

export type { ErrorBoundaryProps, ErrorFallbackProps };
