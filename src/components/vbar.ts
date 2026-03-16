import type { CharGrid, Component, ComponentOverlays, Series, VectorLine, VectorRect, VectorText, ColorCell } from '../types.js';
import * as grid from '../grid.js';
import { AXIS } from '../palette.js';

export interface BarGraphOptions {
  /** Labels for the x-axis. Defaults to index numbers. */
  xLabels?: string[];
  /** Minimum y value (default 0) */
  yMin?: number;
  /** Maximum y value. Auto-calculated if not set. */
  yMax?: number;
  /** Number of y-axis ticks (default 5) */
  yTicks?: number;
  /** Show ASCII legend (default true) */
  legend?: boolean;
  /** Legend position (default 'top') */
  legendPosition?: 'top' | 'bottom';
  /** Bar glow radius (default 3) */
  glow?: number;
  /** Show value labels above bars (default false) */
  valueLabels?: boolean;
  /** Show horizontal grid lines (default false) */
  gridLines?: boolean;
  /** Bar fill ratio within slot (0-1, default 0.8) */
  barFill?: number;
}

export class BarGraph implements Component {
  overlays: ComponentOverlays = {};
  private series: Series[];
  private options: BarGraphOptions;

  constructor(series: Series[], options?: BarGraphOptions) {
    this.series = series;
    this.options = options ?? {};
  }

  render(width: number, height: number): CharGrid {
    const g = grid.create(width, height);
    const vectors: VectorLine[] = [];
    const rects: VectorRect[] = [];
    const texts: VectorText[] = [];
    const colors: ColorCell[] = [];

    if (width < 10 || height < 6 || this.series.length === 0) {
      this.overlays = { vectors, rects, texts, colors };
      return g;
    }

    const showLegend = this.options.legend ?? true;
    const legendPos = this.options.legendPosition ?? 'top';
    const glow = this.options.glow ?? 3;
    const barFill = this.options.barFill ?? 0.8;
    const numSeries = this.series.length;

    // layout
    let legendH = 0;
    if (showLegend && numSeries > 0) {
      legendH = 1;
      const legendY = legendPos === 'top' ? 0 : height - 1;
      this.renderLegend(g, 0, legendY, width, colors);
    }

    const chartTop = legendPos === 'top' ? legendH + (legendH > 0 ? 1 : 0) : 0;
    const chartBottom = legendPos === 'bottom' ? height - legendH - 2 : height - 2;
    const chartH = chartBottom - chartTop;

    // y range
    const allValues = this.series.flatMap(s => s.values);
    let yMin = this.options.yMin ?? 0;
    let yMax = this.options.yMax ?? Math.max(1, ...allValues);
    if (yMin === yMax) { yMin = 0; yMax += 1; }
    const yRange = yMax - yMin;

    const yLabelW = Math.max(
      this.formatValue(yMin).length,
      this.formatValue(yMax).length,
    ) + 1;
    const chartLeft = yLabelW + 1;
    const chartRight = width - 1;
    const chartW = chartRight - chartLeft;

    if (chartH < 3 || chartW < 5) {
      this.overlays = { vectors, rects, texts, colors };
      return g;
    }

    // y-axis ticks + labels
    const yTicks = this.options.yTicks ?? 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = yMin + (yRange * i / yTicks);
      const row = chartBottom - (chartH * i / yTicks);
      texts.push({
        col: chartLeft - 1.5,
        row: row + 0.5,
        text: this.formatValue(val),
        color: '#666666',
        align: 'right',
        baseline: 'middle',
        fontSize: 11,
      });

      // tick mark
      vectors.push({
        points: [
          { col: chartLeft - 0.8, row: row + 0.5 },
          { col: chartLeft - 0.3, row: row + 0.5 },
        ],
        color: AXIS, width: 1, glow: 0,
      });

      // grid line
      if (this.options.gridLines && i > 0 && i < yTicks) {
        vectors.push({
          points: [
            { col: chartLeft, row: row + 0.5 },
            { col: chartRight, row: row + 0.5 },
          ],
          color: '#1a1a1a', width: 0.5, glow: 0,
        });
      }
    }

    // axes
    vectors.push({
      points: [
        { col: chartLeft - 0.5, row: chartTop },
        { col: chartLeft - 0.5, row: chartBottom + 0.3 },
      ],
      color: AXIS, width: 1, glow: 0,
    });
    vectors.push({
      points: [
        { col: chartLeft - 0.5, row: chartBottom + 0.3 },
        { col: chartRight + 0.3, row: chartBottom + 0.3 },
      ],
      color: AXIS, width: 1, glow: 0,
    });

    // bars
    const maxPoints = Math.max(...this.series.map(s => s.values.length));
    const slotW = chartW / maxPoints;
    const groupW = slotW * barFill;
    const barW = groupW / numSeries;
    const groupPad = (slotW - groupW) / 2;

    for (let i = 0; i < maxPoints; i++) {
      const slotLeft = chartLeft + i * slotW + groupPad;

      for (let si = 0; si < numSeries; si++) {
        const val = this.series[si].values[i] ?? 0;
        if (val <= yMin) continue;
        const clampedVal = Math.min(val, yMax);
        const hFrac = (clampedVal - yMin) / yRange;
        const barH = hFrac * chartH;
        const barTop = chartBottom - barH;
        const barLeft = slotLeft + si * barW;

        rects.push({
          col: barLeft,
          row: barTop,
          w: barW,
          h: barH,
          color: this.series[si].color,
          glow,
        });

        // value label above bar
        if (this.options.valueLabels) {
          texts.push({
            col: barLeft + barW / 2,
            row: barTop - 0.3,
            text: this.formatValue(val),
            color: '#888888',
            align: 'center',
            baseline: 'bottom',
            fontSize: 10,
          });
        }
      }
    }

    // x-axis labels
    const xLabels = this.options.xLabels ?? Array.from({ length: maxPoints }, (_, i) => String(i));
    const xLabelRow = chartBottom + 0.8;
    const labelEvery = Math.max(1, Math.ceil(xLabels.length / Math.floor(chartW / 6)));

    for (let i = 0; i < xLabels.length; i += labelEvery) {
      const col = chartLeft + (i + 0.5) * slotW;
      // tick mark
      vectors.push({
        points: [
          { col, row: chartBottom + 0.3 },
          { col, row: chartBottom + 0.7 },
        ],
        color: AXIS, width: 1, glow: 0,
      });
      texts.push({
        col,
        row: xLabelRow,
        text: xLabels[i],
        color: '#666666',
        align: 'center',
        baseline: 'top',
        fontSize: 11,
      });
    }

    this.overlays = { vectors, rects, texts, colors };
    return g;
  }

  private renderLegend(g: CharGrid, x: number, y: number, width: number, colors: ColorCell[]): void {
    let cx = x;
    for (const s of this.series) {
      const entry = `-- ${s.label}`;
      if (cx + entry.length + 2 > width) break;
      grid.write(g, cx, y, entry);
      colors.push({ col: cx, row: y, color: s.color });
      colors.push({ col: cx + 1, row: y, color: s.color });
      cx += entry.length + 3;
    }
  }

  private formatValue(val: number): string {
    if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(val) >= 10_000) return (val / 1_000).toFixed(0) + 'k';
    if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(1) + 'k';
    if (Number.isInteger(val)) return String(val);
    return val.toFixed(1);
  }

  setData(series: Series[]): void { this.series = series; }
}
