declare module '@contractspec/lib.contracts' {
  export * from '@contractspec/lib.contracts-spec';

  export function createMcpServer(...args: unknown[]): void;

  export function createDefaultTransformEngine(...args: unknown[]): unknown;
}
