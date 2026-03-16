import { grid, Box, Row, Text, LineGraph, palette } from '../../src/index.js';
import type { RenderResult, ColorCell, Series } from '../../src/index.js';
import type { Scene } from './types.js';

const WINDOW = 30;
const LOG_SIZE = 15;

let value = 50;
const values: number[] = Array.from({ length: WINDOW }, () => {
  value += (Math.random() - 0.5) * 10;
  value = Math.max(0, Math.min(100, value));
  return Math.round(value);
});
const labels: string[] = values.map((_, i) => String(i));

let total = values.reduce((a, b) => a + b, 0);
let count = values.length;
let min = Math.min(...values);
let max = Math.max(...values);
const events: string[] = [];
let eventId = 0;
let pulseOn = true;
let labelCounter = WINDOW;
let interval: ReturnType<typeof setInterval> | null = null;

function push(v: number): void {
  values.push(v);
  labels.push(String(labelCounter++));
  if (values.length > WINDOW) { values.shift(); labels.shift(); }
  total += v; count++;
  if (v < min) min = v;
  if (v > max) max = v;
}

function logEvent(v: number, delta: number): void {
  const dir = delta > 0 ? '+' : '';
  events.push(`#${String(++eventId).padStart(4, '0')}  val=${String(v).padStart(3)} (${dir}${delta.toFixed(1)})`);
  if (events.length > LOG_SIZE) events.shift();
}

export const streaming: Scene = {
  name: 'STREAMING',

  start(update) {
    interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 20;
      value = Math.max(0, Math.min(100, value + delta));
      const v = Math.round(value);
      push(v);
      logEvent(v, delta);
      pulseOn = !pulseOn;
      update();
    }, 500);
  },

  stop() {
    if (interval) { clearInterval(interval); interval = null; }
  },

  render(w, h) {
    const g = grid.create(w, h);
    const colors: ColorCell[] = [];
    const allVectors: any[] = [];
    const allRects: any[] = [];
    const allTexts: any[] = [];

    // status indicator
    const status = 'RECEIVING';
    const statusX = w - status.length - 1;
    grid.write(g, statusX, 0, status);
    const statusColor = pulseOn ? palette.GREEN : palette.GRAY;
    for (let i = 0; i < status.length; i++) colors.push({ col: statusX + i, row: 0, color: statusColor });

    // chart + stats
    const statsW = 28;
    const chartH = Math.max(5, Math.floor(h * 0.6));

    const series: Series[] = [{ label: 'Signal', values: [...values], color: palette.CYAN }];
    const chartBox = new Box('Signal', new LineGraph(series, { xLabels: labels.slice(), yMin: 0, yMax: 100, glow: 6, lineWidth: 1.5, gridLines: true }));
    const avg = count > 0 ? (total / count).toFixed(1) : '0';
    const statsLines = [
      `MIN     ${String(min).padStart(6)}`, `MAX     ${String(max).padStart(6)}`,
      `AVG     ${avg.padStart(6)}`, `TOTAL   ${String(total).padStart(6)}`,
      `SAMPLES ${String(count).padStart(6)}`, '',
      `WINDOW  ${String(WINDOW).padStart(6)}`, `RATE    ${'500ms'.padStart(6)}`,
    ];
    const statsBox = new Box('Stats', new Text(statsLines.join('\n')));
    const topRow = new Row([{ component: chartBox, flex: 1 }, { component: statsBox, width: statsW }]);
    grid.overlay(g, topRow.render(w, chartH), 0, 1);
    const ov = grid.collectOverlays(topRow, 0, 1);
    allVectors.push(...ov.vectors);
    allRects.push(...ov.rects);
    allTexts.push(...ov.texts);
    colors.push(...ov.colors);

    // dim stat labels
    for (let i = 0; i < statsLines.length; i++) {
      const r = 3 + i;
      const label = statsLines[i].split(' ')[0];
      if (label && r < h) {
        const sx = w - statsW + 2;
        for (let c = 0; c < label.length; c++) colors.push({ col: sx + c, row: r, color: palette.GRAY });
      }
    }

    // event log
    const logY = chartH + 2;
    const logH = h - logY;
    if (logH > 2) {
      grid.overlay(g, new Box('Events', new Text(events.slice(-(logH - 2)).join('\n'))).render(w, logH), 0, logY);
      for (let r = logY + 1; r < logY + logH - 1 && r < h; r++) {
        for (let c = 1; c < w - 1; c++) {
          if (g[r]?.[c] && g[r][c] !== ' ') colors.push({ col: c, row: r, color: palette.GRAY });
        }
      }
    }

    return { grid: g, colors, vectors: allVectors, rects: allRects, texts: allTexts };
  },
};
