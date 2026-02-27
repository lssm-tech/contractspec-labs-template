import type {
  OperationSpecRegistry,
  PresentationSpec,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts';
import { createMcpServer } from '@contractspec/lib.contracts';
import { Logger } from '@contractspec/lib.logger';
import { createMcpHandler } from 'mcp-handler';

interface McpHttpHandlerConfig {
  path: string;
  serverName: string;
  ops: OperationSpecRegistry;
  resources: ResourceRegistry;
  prompts: PromptRegistry;
  presentationsV2?: PresentationSpec[];
  logger: Logger;
}

const baseCtx = {
  actor: 'anonymous' as const,
  decide: async () => ({ effect: 'allow' as const }),
};

export function createMcpNextjsHandler({
  path,
  serverName,
  ops,
  resources,
  prompts,
  presentationsV2,
  logger,
}: McpHttpHandlerConfig) {
  return createMcpHandler(
    (server) => {
      createMcpServer(server, ops, resources, prompts, {
        logger,
        toolCtx: () => baseCtx,
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
        presentationsV2,
      });
    },
    {
      serverInfo: {
        name: serverName,
        version: '1.0.0',
      },
    },
    {
      basePath: path,
      disableSse: true,
      verboseLogs: true,
    }
  );
}
