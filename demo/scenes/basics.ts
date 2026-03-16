import { grid, Box, Row, Text, Table, BarChart, Tabs, palette } from '../../src/index.js';
import type { RenderResult, ClickRegion, ColorCell } from '../../src/index.js';
import type { Scene } from './types.js';

let activeTab = 0;
let tabs: Tabs;
let update: () => void;

const chartData = {
  labels: ['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05',
           '2025-01-06', '2025-01-07', '2025-01-08', '2025-01-09', '2025-01-10'],
  values: [12, 45, 23, 67, 34, 89, 56, 78, 42, 91],
};

const tableColumns = [
  { header: 'NAME', flex: 2 },
  { header: 'STATUS', width: 12, align: 'center' as const },
  { header: 'VALUE', width: 10, align: 'right' as const },
];

const tableData = [
  ['Alpha Service', 'ONLINE', '1,234'],
  ['Beta Worker', 'ONLINE', '567'],
  ['Gamma Cache', 'DEGRADED', '89'],
  ['Delta Queue', 'ONLINE', '2,345'],
  ['Epsilon Store', 'OFFLINE', '0'],
];

export const basics: Scene = {
  name: 'BASICS',

  start(u) {
    update = u;
    activeTab = 0;
    tabs = new Tabs(['OVERVIEW', 'CHART', 'TABLE'], 0, (i) => {
      activeTab = i;
      update();
    });
  },

  stop() {},

  render(w, h) {
    const g = grid.create(w, h);
    const clicks: ClickRegion[] = [];
    const colors: ColorCell[] = [];

    // sub-tabs
    grid.overlay(g, tabs.render(w, 1), 0, 0);
    clicks.push({ x: 0, y: 0, w, h: 1, handler: () => {}, cursor: 'pointer' });

    const cy = 2;
    const ch = h - cy;

    if (activeTab === 0) {
      const left = new Box('Status', new Text('All systems operational.\n\nTessera is a browser-canvas ASCII\ncomponent framework. Build retro\nterminal dashboards with zero deps.'));
      const right = new Box('Metrics', new Text('Uptime: 99.97%\nRequests: 1.2M\nLatency: 12ms p50\nErrors: 0.03%'));
      grid.overlay(g, new Row([left, right]).render(w, ch), 0, cy);
    } else if (activeTab === 1) {
      grid.overlay(g, new Box('Daily Volume', new BarChart(chartData)).render(w, ch), 0, cy);
    } else {
      grid.overlay(g, new Box('Services', new Table(tableColumns, tableData)).render(w, ch), 0, cy);
    }

    return { grid: g, clicks, colors };
  },

  click(col, row) {
    if (row === 0) {
      tabs.hitTest(col, 0);
      update();
    }
  },
};
