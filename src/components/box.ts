import type { CharGrid, Component, ComponentOverlays, BoxCharSet, VectorLine, VectorRect, VectorText, ColorCell, ClickRegion } from '../types.js';
import { BoxChars } from '../types.js';
import * as grid from '../grid.js';

export interface BoxOptions {
  chars?: BoxCharSet;
  padding?: number;
}

export class Box implements Component {
  overlays: ComponentOverlays = {};
  private title: string | null;
  private child: Component | null;
  private chars: BoxCharSet;
  private padding: number;

  constructor(title: string | null, child: Component | null, options: BoxOptions = {}) {
    this.title = title;
    this.child = child;
    this.chars = options.chars ?? BoxChars.single;
    this.padding = options.padding ?? 1;
  }

  render(width: number, height: number): CharGrid {
    const g = grid.create(width, height);
    const { tl, tr, bl, br, h, v } = this.chars;
    if (width < 2 || height < 2) {
      this.overlays = {};
      return g;
    }

    grid.write(g, 0, 0, tl + h.repeat(width - 2) + tr);
    if (this.title && width > 4) {
      grid.write(g, 1, 0, ` ${grid.truncate(this.title, width - 4)} `);
    }
    for (let y = 1; y < height - 1; y++) {
      grid.write(g, 0, y, v);
      grid.write(g, width - 1, y, v);
    }
    grid.write(g, 0, height - 1, bl + h.repeat(width - 2) + br);

    const innerX = 1 + this.padding;
    const innerY = 1 + this.padding;

    if (this.child) {
      const innerW = width - 2 - (this.padding * 2);
      const innerH = height - 2 - (this.padding * 2);
      if (innerW > 0 && innerH > 0) {
        grid.overlay(g, this.child.render(innerW, innerH), innerX, innerY);

        // propagate child overlays with inner offset
        const co = this.child.overlays;
        if (co) {
          const vectors: VectorLine[] = [];
          const rects: VectorRect[] = [];
          const texts: VectorText[] = [];
          const colors: ColorCell[] = [];
          const clicks: ClickRegion[] = [];

          for (const vl of co.vectors ?? []) {
            vectors.push({ ...vl, points: vl.points.map(p => ({ col: p.col + innerX, row: p.row + innerY })) });
          }
          for (const r of co.rects ?? []) {
            rects.push({ ...r, col: r.col + innerX, row: r.row + innerY });
          }
          for (const t of co.texts ?? []) {
            texts.push({ ...t, col: t.col + innerX, row: t.row + innerY });
          }
          for (const c of co.colors ?? []) {
            colors.push({ ...c, col: c.col + innerX, row: c.row + innerY });
          }
          for (const cl of co.clicks ?? []) {
            clicks.push({ ...cl, x: cl.x + innerX, y: cl.y + innerY });
          }

          this.overlays = { vectors, rects, texts, colors, clicks };
        } else {
          this.overlays = {};
        }
      } else {
        this.overlays = {};
      }
    } else {
      this.overlays = {};
    }

    return g;
  }

  setTitle(title: string | null): void { this.title = title; }
  setChild(child: Component | null): void { this.child = child; }
}
