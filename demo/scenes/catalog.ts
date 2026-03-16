import { grid, Box, Row, Col, Text, Table, BarChart, Button, Tabs, LineGraph, BarGraph, palette, BoxChars } from '../../src/index.js';
import type { RenderResult, ClickRegion, ColorCell, Series } from '../../src/index.js';
import type { Scene } from './types.js';

let activeTab = 0;
let tabs: Tabs;
let update: () => void;
const tabNames = ['TEXT', 'BOX', 'LAYOUT', 'TABLE', 'CHART', 'GRAPH', 'INTERACTIVE'];

function lbl(g: string[][], x: number, y: number, text: string, colors: ColorCell[]): void {
  grid.write(g, x, y, text);
  for (let i = 0; i < text.length; i++) colors.push({ col: x + i, row: y, color: palette.GRAY });
}

function renderText(g: string[][], x: number, y: number, w: number, colors: ColorCell[]): void {
  lbl(g, x, y, 'new Text("Hello, Tessera!")', colors);
  grid.overlay(g, new Text('Hello, Tessera!').render(w, 1), x, y + 1);
  lbl(g, x, y + 3, 'new Text("Centered text", "center")', colors);
  grid.overlay(g, new Text('Centered text', 'center').render(w, 1), x, y + 4);
  lbl(g, x, y + 6, 'new Text("Right-aligned", "right")', colors);
  grid.overlay(g, new Text('Right-aligned', 'right').render(w, 1), x, y + 7);
  lbl(g, x, y + 9, 'new Text(<long string>) // auto word-wrap', colors);
  grid.overlay(g, new Text('This is a longer piece of text that will automatically wrap to fit within the available width of the component.').render(w, 4), x, y + 10);
}

function renderBox(g: string[][], x: number, y: number, w: number, colors: ColorCell[]): void {
  const bw = Math.min(36, Math.floor((w - 2) / 2));
  const bh = 6;
  lbl(g, x, y, 'new Box("Title", child)', colors);
  grid.overlay(g, new Box('Single', new Text('Default box chars')).render(bw, bh), x, y + 1);
  lbl(g, x + bw + 2, y, 'Box { chars: BoxChars.double }', colors);
  grid.overlay(g, new Box('Double', new Text('Double-line border'), { chars: BoxChars.double }).render(bw, bh), x + bw + 2, y + 1);
  lbl(g, x, y + bh + 2, 'Box { chars: BoxChars.rounded }', colors);
  grid.overlay(g, new Box('Rounded', new Text('Rounded corners'), { chars: BoxChars.rounded }).render(bw, bh), x, y + bh + 3);
  lbl(g, x + bw + 2, y + bh + 2, 'Box { chars: BoxChars.ascii }', colors);
  grid.overlay(g, new Box('ASCII', new Text('Plain ASCII chars'), { chars: BoxChars.ascii }).render(bw, bh), x + bw + 2, y + bh + 3);
  lbl(g, x, y + (bh + 2) * 2, 'new Box(null, child)', colors);
  grid.overlay(g, new Box(null, new Text('No title')).render(bw, 4), x, y + (bh + 2) * 2 + 1);
  lbl(g, x + bw + 2, y + (bh + 2) * 2, 'Box { padding: 2 }', colors);
  grid.overlay(g, new Box('Padded', new Text('Extra space'), { padding: 2 }).render(bw, bh), x + bw + 2, y + (bh + 2) * 2 + 1);
}

function renderLayout(g: string[][], x: number, y: number, w: number, h: number, colors: ColorCell[]): void {
  const rh = 5;
  lbl(g, x, y, 'new Row([boxA, boxB, boxC])', colors);
  grid.overlay(g, new Row([new Box('A', new Text('flex: 1')), new Box('B', new Text('flex: 1')), new Box('C', new Text('flex: 1'))]).render(w, rh), x, y + 1);
  const y2 = y + rh + 2;
  lbl(g, x, y2, 'Row([{ width: 20 }, { flex: 2 }, { flex: 1 }])', colors);
  grid.overlay(g, new Row([
    { component: new Box('Fixed', new Text('width: 20')), width: 20 },
    { component: new Box('Wide', new Text('flex: 2')), flex: 2 },
    { component: new Box('Narrow', new Text('flex: 1')), flex: 1 },
  ]).render(w, rh), x, y2 + 1);
  const y3 = y2 + rh + 2;
  lbl(g, x, y3, 'Col([{ height: 3 }, { flex: 1 }])', colors);
  const ch = Math.min(12, h - (y3 - y) - 1);
  grid.overlay(g, new Col([
    { component: new Box('Header', new Text('height: 3')), height: 3 },
    { component: new Box('Body', new Text('flex: 1')), flex: 1 },
  ]).render(Math.floor(w / 2), ch), x, y3 + 1);
  lbl(g, x + Math.floor(w / 2) + 1, y3, 'Nested: Col > Row', colors);
  grid.overlay(g, new Col([
    { component: new Box('Top', new Text('fixed')), height: 3 },
    { component: new Row([new Box('Left', new Text('A')), new Box('Right', new Text('B'))]), flex: 1 },
  ]).render(Math.floor(w / 2) - 1, ch), x + Math.floor(w / 2) + 1, y3 + 1);
}

function renderTable(g: string[][], x: number, y: number, w: number, colors: ColorCell[]): void {
  lbl(g, x, y, 'new Table(columns, data)', colors);
  grid.overlay(g, new Table(
    [{ header: 'NAME', flex: 2 }, { header: 'TYPE', width: 10, align: 'center' }, { header: 'VALUE', width: 10, align: 'right' }],
    [['Alpha', 'STRING', 'hello'], ['Beta', 'NUMBER', '42'], ['Gamma', 'BOOL', 'true'], ['Delta', 'ARRAY', '[1,2,3]']],
  ).render(Math.min(w, 60), 8), x, y + 1);
  const y2 = y + 10;
  lbl(g, x, y2, 'Table with flex columns', colors);
  grid.overlay(g, new Table(
    [{ header: 'ID', width: 6 }, { header: 'DESCRIPTION', flex: 3 }, { header: 'STATUS', flex: 1, align: 'center' }, { header: 'PRIORITY', width: 10, align: 'right' }],
    [['001', 'Implement user auth', 'DONE', 'HIGH'], ['002', 'Add caching layer', 'IN PROGRESS', 'MEDIUM'], ['003', 'Write integration tests', 'TODO', 'LOW'], ['004', 'Deploy to production', 'BLOCKED', 'HIGH']],
  ).render(w, 8), x, y2 + 1);
}

function renderChart(g: string[][], x: number, y: number, w: number, h: number, colors: ColorCell[]): void {
  const ch = Math.floor((h - 4) / 2);
  lbl(g, x, y, 'new BarChart({ labels, values })', colors);
  grid.overlay(g, new BarChart({ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [25, 42, 38, 67, 55, 30, 48] }).render(w, ch), x, y + 1);
  const y2 = y + ch + 2;
  lbl(g, x, y2, 'new BarChart(data, { fill: true })', colors);
  grid.overlay(g, new BarChart({ labels: Array.from({ length: 20 }, (_, i) => String(i)), values: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)) }, { fill: true }).render(w, ch), x, y2 + 1);
}

interface GraphOverlays { vectors: any[]; rects: any[]; texts: any[]; }

function renderGraph(g: string[][], x: number, y: number, w: number, h: number, colors: ColorCell[]): GraphOverlays {
  const gh = Math.floor((h - 4) / 2);
  lbl(g, x, y, 'new LineGraph(series, { gridLines: true })', colors);
  const ll = new Row([new LineGraph([
    { label: 'Revenue', values: [10, 25, 18, 42, 35, 55, 48, 62, 58, 70], color: palette.BLUE },
    { label: 'Costs', values: [8, 15, 12, 28, 22, 35, 30, 40, 38, 45], color: palette.RED },
  ], { xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], gridLines: true })]);
  grid.overlay(g, ll.render(w, gh), x, y + 1);
  const lo = grid.collectOverlays(ll, x, y + 1);

  const y2 = y + gh + 2;
  lbl(g, x, y2, 'new BarGraph(series, { valueLabels: true })', colors);
  const bl = new Row([new BarGraph([
    { label: 'Q1', values: [120, 95, 140, 85], color: palette.CYAN },
    { label: 'Q2', values: [150, 110, 130, 100], color: palette.PURPLE },
  ], { xLabels: ['North', 'South', 'East', 'West'], valueLabels: true, gridLines: true })]);
  grid.overlay(g, bl.render(w, gh), x, y2 + 1);
  const bo = grid.collectOverlays(bl, x, y2 + 1);

  colors.push(...lo.colors, ...bo.colors);
  return {
    vectors: [...lo.vectors, ...bo.vectors],
    rects: [...lo.rects, ...bo.rects],
    texts: [...lo.texts, ...bo.texts],
  };
}

function renderInteractive(g: string[][], x: number, y: number, w: number, colors: ColorCell[]): void {
  lbl(g, x, y, 'new Tabs(items, active, onChange)', colors);
  grid.overlay(g, new Tabs(['ONE', 'TWO', 'THREE'], 0).render(w, 1), x, y + 1);
  lbl(g, x, y + 3, 'new Button("label", handler)', colors);
  grid.overlay(g, new Button('Click Me').render(16, 1), x, y + 4);
  grid.overlay(g, new Button('Submit').render(14, 1), x + 18, y + 4);
  grid.overlay(g, new Button('Cancel').render(14, 1), x + 34, y + 4);
  lbl(g, x, y + 7, 'ClickRegion: { x, y, w, h, handler }', colors);
  grid.overlay(g, new Text([
    'Click regions are registered in RenderResult.',
    'The App routes canvas clicks to matching regions.',
    'Tabs use hitTest() for fine-grained routing.',
    '', 'Keyboard events via app.onKey(handler).',
  ].join('\n')).render(w, 6), x, y + 8);
}

export const catalog: Scene = {
  name: 'CATALOG',

  start(u) {
    update = u;
    activeTab = 0;
    tabs = new Tabs(tabNames, 0, (i) => { activeTab = i; update(); });
  },

  stop() {},

  render(w, h) {
    const g = grid.create(w, h);
    const clicks: ClickRegion[] = [];
    const colors: ColorCell[] = [];

    // sub-tabs
    grid.overlay(g, tabs.render(w, 1), 0, 0);
    clicks.push({ x: 0, y: 0, w, h: 1, handler: () => {}, cursor: 'pointer' });

    const cx = 1;
    const cy = 2;
    const cw = w - 2;
    const ch = h - cy;

    let graphOv: GraphOverlays | null = null;

    switch (activeTab) {
      case 0: renderText(g, cx, cy, cw, colors); break;
      case 1: renderBox(g, cx, cy, cw, colors); break;
      case 2: renderLayout(g, cx, cy, cw, ch, colors); break;
      case 3: renderTable(g, cx, cy, cw, colors); break;
      case 4: renderChart(g, cx, cy, cw, ch, colors); break;
      case 5: graphOv = renderGraph(g, cx, cy, cw, ch, colors); break;
      case 6: renderInteractive(g, cx, cy, cw, colors); break;
    }

    return {
      grid: g, clicks, colors,
      vectors: graphOv?.vectors ?? [],
      rects: graphOv?.rects ?? [],
      texts: graphOv?.texts ?? [],
    };
  },

  click(col, row) {
    if (row === 0) { tabs.hitTest(col, 0); update(); }
  },

  key(e) {
    if (e.key === 'ArrowLeft' && activeTab > 0) { activeTab--; tabs.setActive(activeTab); update(); }
    else if (e.key === 'ArrowRight' && activeTab < tabNames.length - 1) { activeTab++; tabs.setActive(activeTab); update(); }
  },
};
