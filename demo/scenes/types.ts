import type { RenderResult } from '../../src/index.js';

export interface Scene {
  name: string;
  render(w: number, h: number): RenderResult;
  start(update: () => void): void;
  stop(): void;
  click?(col: number, row: number, contentX: number, contentY: number): void;
  key?(e: KeyboardEvent): void;
}
