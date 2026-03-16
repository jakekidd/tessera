import { grid, Box, Row, Text, Table, BarGraph, palette } from '../../src/index.js';
import type { RenderResult, ColorCell, Series } from '../../src/index.js';
import type { Scene } from './types.js';

interface Metric { label: string; value: string; health: 'green' | 'yellow' | 'red'; }

const metrics: Metric[] = [
  { label: 'UPTIME', value: '99.97%', health: 'green' },
  { label: 'RPS', value: '1,247', health: 'green' },
  { label: 'ERRORS', value: '0.03%', health: 'green' },
  { label: 'LATENCY', value: '12ms', health: 'green' },
];

const services = [
  ['api-gateway', 'ONLINE', '1,247 rps', '12ms'],
  ['auth-service', 'ONLINE', '892 rps', '8ms'],
  ['data-store', 'ONLINE', '2,103 rps', '3ms'],
  ['cache-layer', 'DEGRADED', '456 rps', '45ms'],
  ['worker-pool', 'ONLINE', '678 rps', '22ms'],
  ['cdn-edge', 'ONLINE', '3,891 rps', '2ms'],
];

const chartValues = [45, 52, 38, 67, 72, 58, 81, 74, 63, 88, 92, 79];
const chartLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
const logs: string[] = [
  '[00:01] api-gateway: health check OK',
  '[00:02] auth-service: token refresh',
  '[00:03] data-store: compaction (2.3s)',
  '[00:04] cache-layer: eviction (1.2k)',
  '[00:05] worker-pool: batch (45 jobs)',
];

let tick = 6;
let hourCounter = 12;
let interval: ReturnType<typeof setInterval> | null = null;

function healthColor(h: string): string {
  return h === 'green' ? palette.GREEN : h === 'yellow' ? palette.YELLOW : palette.RED;
}

function randomize(): void {
  const uptime = (99.9 + Math.random() * 0.09).toFixed(2);
  metrics[0].value = `${uptime}%`;
  metrics[0].health = +uptime >= 99.95 ? 'green' : +uptime >= 99.5 ? 'yellow' : 'red';
  const rps = Math.floor(1000 + Math.random() * 500);
  metrics[1].value = rps.toLocaleString();
  metrics[1].health = rps >= 800 ? 'green' : rps >= 500 ? 'yellow' : 'red';
  const errors = (Math.random() * 0.1).toFixed(2);
  metrics[2].value = `${errors}%`;
  metrics[2].health = +errors <= 0.05 ? 'green' : +errors <= 0.1 ? 'yellow' : 'red';
  const lat = Math.floor(5 + Math.random() * 30);
  metrics[3].value = `${lat}ms`;
  metrics[3].health = lat <= 20 ? 'green' : lat <= 50 ? 'yellow' : 'red';

  chartValues.shift();
  chartValues.push(Math.floor(30 + Math.random() * 70));
  chartLabels.shift();
  chartLabels.push(String(hourCounter++).padStart(2, '0'));

  for (const svc of services) {
    svc[2] = `${Math.floor(200 + Math.random() * 4000).toLocaleString()} rps`;
    svc[3] = `${Math.floor(1 + Math.random() * 50)}ms`;
    const roll = Math.random();
    svc[1] = roll > 0.95 ? 'OFFLINE' : roll > 0.85 ? 'DEGRADED' : 'ONLINE';
  }

  const svc = services[Math.floor(Math.random() * services.length)][0];
  const msgs = ['health check OK', 'spike detected', 'cache miss elevated', 'pool recycled', 'config reload', 'batch queued'];
  logs.push(`[00:${String(tick++).padStart(2, '0')}] ${svc}: ${msgs[Math.floor(Math.random() * msgs.length)]}`);
  if (logs.length > 20) logs.shift();
}

export const dashboard: Scene = {
  name: 'DASHBOARD',

  start(update) {
    interval = setInterval(() => { randomize(); update(); }, 2000);
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

    // metric boxes
    const metricH = 3;
    const metricBoxes = metrics.map(m => new Box(m.label, new Text(m.value, 'center'), { padding: 0 }));
    const metricRow = new Row(metricBoxes);
    grid.overlay(g, metricRow.render(w, metricH), 0, 0);

    let mx = 0;
    const metricW = Math.floor(w / metrics.length);
    for (let i = 0; i < metrics.length; i++) {
      const color = healthColor(metrics[i].health);
      for (let c = mx + 1; c < mx + metricW - 1; c++) {
        colors.push({ col: c, row: 1, color });
      }
      mx += metricW;
    }

    // middle: chart + table
    const middleY = metricH + 1;
    const bottomLogH = Math.min(8, Math.max(4, Math.floor(h * 0.25)));
    const middleH = h - metricH - 1 - bottomLogH - 1;

    if (middleH > 3) {
      const barSeries: Series[] = [{ label: 'Throughput', values: [...chartValues], color: palette.BLUE }];
      const chartBox = new Box('Throughput', new BarGraph(barSeries, { xLabels: [...chartLabels], glow: 3, gridLines: true }));
      const tableCols = [
        { header: 'SERVICE', flex: 2 },
        { header: 'STATUS', width: 10, align: 'center' as const },
        { header: 'RATE', width: 12, align: 'right' as const },
        { header: 'P50', width: 8, align: 'right' as const },
      ];
      const mid = new Row([{ component: chartBox, flex: 2 }, { component: new Box('Services', new Table(tableCols, services)), flex: 1 }]);
      grid.overlay(g, mid.render(w, middleH), 0, middleY);
      const ov = grid.collectOverlays(mid, 0, middleY);
      allVectors.push(...ov.vectors);
      allRects.push(...ov.rects);
      allTexts.push(...ov.texts);
      colors.push(...ov.colors);

      // color service statuses
      for (let r = 0; r < services.length; r++) {
        const status = services[r][1];
        const color = status === 'ONLINE' ? palette.GREEN : status === 'DEGRADED' ? palette.YELLOW : palette.RED;
        const rowY = middleY + 3 + r;
        if (rowY < h) {
          const line = g[rowY]?.join('') ?? '';
          const tableX = Math.floor(w * 2 / 3);
          const idx = line.indexOf(status, tableX);
          if (idx >= 0) {
            for (let c = idx; c < idx + status.length; c++) colors.push({ col: c, row: rowY, color });
          }
        }
      }
    }

    // log
    const logY = h - bottomLogH;
    if (logY > middleY && bottomLogH > 2) {
      grid.overlay(g, new Box('Log', new Text(logs.slice(-bottomLogH + 2).join('\n'))).render(w, bottomLogH), 0, logY);
      for (let r = logY + 1; r < logY + bottomLogH - 1 && r < h; r++) {
        for (let c = 1; c < w - 1; c++) {
          if (g[r]?.[c] && g[r][c] !== ' ') colors.push({ col: c, row: r, color: palette.GRAY });
        }
      }
    }

    return { grid: g, colors, vectors: allVectors, rects: allRects, texts: allTexts };
  },
};
