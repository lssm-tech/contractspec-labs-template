import * as React from 'react';
import { Button } from '../atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import { getDesignSystemLocale } from '../../lib/utils';
// } from './DropdownMenu';

type Provider = 'chatgpt' | 'claude';

export interface AiLinkButtonProps {
  href: string; // canonical or .md URL
  provider?: Provider;
  className?: string;
}

type ErrorReporter = (error: Error) => void;

const AI_LINK_BUTTON_COPY = {
  actions: {
    en: 'AI actions',
    fr: 'Actions IA',
    es: 'Acciones de IA',
  },
  ai: {
    en: 'AI',
    fr: 'IA',
    es: 'IA',
  },
  getLink: {
    en: 'Get link for AI',
    fr: "Obtenir le lien pour l'IA",
    es: 'Obtener enlace para IA',
  },
  openChatgpt: {
    en: 'Open in ChatGPT',
    fr: 'Ouvrir dans ChatGPT',
    es: 'Abrir en ChatGPT',
  },
  openClaude: {
    en: 'Open in Claude',
    fr: 'Ouvrir dans Claude',
    es: 'Abrir en Claude',
  },
} as const;

function reportCaughtError(context: string, error: unknown): void {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error));
  const report = (
    globalThis as typeof globalThis & { reportError?: ErrorReporter }
  ).reportError;
  report?.(
    new Error(`[AiLinkButton] ${context}`, {
      cause: normalizedError,
    })
  );
}

function copyHrefToClipboard(href: string, context: string): void {
  try {
    navigator.clipboard?.writeText(href).catch((error) => {
      reportCaughtError(context, error);
    });
  } catch (error) {
    reportCaughtError(context, error);
  }
}

function buildPrompt(href: string) {
  return `Please load and use this markdown context when answering: ${href}`;
}

function buildProviderUrl(provider: Provider, href: string) {
  const prompt = encodeURIComponent(buildPrompt(href));
  switch (provider) {
    case 'claude':
      return `https://claude.ai/new?prompt=${prompt}`;
    case 'chatgpt':
    default:
      return `https://chatgpt.com/?q=${prompt}`;
  }
}

export function AiLinkButton({ href, className }: AiLinkButtonProps) {
  const locale = getDesignSystemLocale();

  const copyLink = React.useCallback(() => {
    copyHrefToClipboard(href, 'copy link action failed');
  }, [href]);

  const openChatGPT = React.useCallback(() => {
    const url = buildProviderUrl('chatgpt', href);
    copyHrefToClipboard(href, 'ChatGPT clipboard prefill failed');
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [href]);

  const openClaude = React.useCallback(() => {
    const url = buildProviderUrl('claude', href);
    copyHrefToClipboard(href, 'Claude clipboard prefill failed');
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [href]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={className}
          variant="secondary"
          aria-label={AI_LINK_BUTTON_COPY.actions[locale]}
        >
          {AI_LINK_BUTTON_COPY.ai[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          {AI_LINK_BUTTON_COPY.getLink[locale]}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openChatGPT}>
          {AI_LINK_BUTTON_COPY.openChatgpt[locale]}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openClaude}>
          {AI_LINK_BUTTON_COPY.openClaude[locale]}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
