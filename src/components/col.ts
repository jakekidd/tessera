import type { CharGrid, Component, ComponentOverlays, VectorLine, VectorRect, VectorText, ColorCell, ClickRegion } from '../types.js';
import * as grid from '../grid.js';

export interface ColChild {
  component: Component;
  height?: number;
  flex?: number;
}

export class Col implements Component {
  overlays: ComponentOverlays = {};
  private children: ColChild[];

  constructor(children: (Component | ColChild)[]) {
    this.children = children.map(c =>
      'component' in c ? c : { component: c, flex: 1 }
    );
  }

  render(width: number, height: number): CharGrid {
    const g = grid.create(width, height);
    const vectors: VectorLine[] = [];
    const rects: VectorRect[] = [];
    const texts: VectorText[] = [];
    const colors: ColorCell[] = [];
    const clicks: ClickRegion[] = [];

    if (this.children.length === 0) {
      this.overlays = {};
      return g;
    }

    const heights = this.distribute(height);
    let y = 0;
    for (let i = 0; i < this.children.length; i++) {
      const h = heights[i];
      if (h > 0) {
        const child = this.children[i];
        grid.overlay(g, child.component.render(width, h), 0, y);
        if ('bounds' in child.component) {
          (child.component as { bounds: unknown }).bounds = { x: 0, y, w: width, h };
        }
        // propagate child overlays with y offset
        const co = child.component.overlays;
        if (co) {
          for (const v of co.vectors ?? []) {
            vectors.push({ ...v, points: v.points.map(p => ({ col: p.col, row: p.row + y })) });
          }
          for (const r of co.rects ?? []) {
            rects.push({ ...r, row: r.row + y });
          }
          for (const t of co.texts ?? []) {
            texts.push({ ...t, row: t.row + y });
          }
          for (const c of co.colors ?? []) {
            colors.push({ ...c, row: c.row + y });
          }
          for (const cl of co.clicks ?? []) {
            clicks.push({ ...cl, y: cl.y + y });
          }
        }
      }
      y += h;
    }

    this.overlays = { vectors, rects, texts, colors, clicks };
    return g;
  }

  private distribute(total: number): number[] {
    const heights = new Array(this.children.length).fill(0);
    let remaining = total;
    let totalFlex = 0;

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.height !== undefined) {
        heights[i] = Math.min(child.height, remaining);
        remaining -= heights[i];
      } else {
        totalFlex += child.flex ?? 1;
      }
    }

    if (totalFlex > 0 && remaining > 0) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].height === undefined) {
          heights[i] = Math.floor(((this.children[i].flex ?? 1) / totalFlex) * remaining);
        }
      }
    }
    return heights;
  }
}
