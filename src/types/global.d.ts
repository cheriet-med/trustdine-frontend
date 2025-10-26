export {};

declare global {
  interface Window {
    ym: {
      (counterId: number, action: 'init', config: Record<string, unknown>): void;
      (counterId: number, action: string, ...args: unknown[]): void;
      a?: unknown[][];
      l?: number;
    };
  }
}