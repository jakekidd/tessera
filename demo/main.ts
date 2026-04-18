import { graticule, grid, Tabs, palette } from '../src/index.js';
import type { RenderResult, ClickRegion, ColorCell } from '../src/index.js';
import { basics } from './scenes/basics.js';
import { dashboard } from './scenes/dashboard.js';
import { streaming } from './scenes/streaming.js';
import { catalog } from './scenes/catalog.js';
import type { Scene } from './scenes/types.js';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const app = graticule(canvas, { fontSize: 14 });

const scenes: Scene[] = [basics, dashboard, streaming, catalog];
let activeScene = 0;

const sceneTabs = new Tabs(scenes.map(s => s.name), 0, (i) => {
  switchScene(i);
});

function switchScene(index: number): void {
  scenes[activeScene].stop();
  activeScene = index;
  sceneTabs.setActive(index);
  scenes[activeScene].start(() => app.update());
  app.update();
}

app.render = (cols: number, rows: number): RenderResult => {
  const g = grid.create(cols, rows);
  const clicks: ClickRegion[] = [];
  const colors: ColorCell[] = [];

  // title
  const title = 'GRATICULE';
  grid.write(g, 1, 0, title);
  for (let i = 0; i < title.length; i++) {
    colors.push({ col: 1 + i, row: 0, color: palette.BLUE });
  }

  // scene tabs
  const tabX = title.length + 3;
  const tabGrid = sceneTabs.render(cols - tabX - 1, 1);
  grid.overlay(g, tabGrid, tabX, 0);
  clicks.push({ x: tabX, y: 0, w: cols - tabX - 1, h: 1, handler: () => {}, cursor: 'pointer' });

  // content area
  const contentY = 2;
  const contentW = cols - 2;
  const contentH = rows - contentY - 1;

  const scene = scenes[activeScene];
  const result = scene.render(contentW, contentH);
  grid.overlay(g, result.grid, 1, contentY);

  // merge scene overlays with offset
  const vectors = (result.vectors ?? []).map(v => ({
    ...v,
    points: v.points.map(p => ({ col: p.col + 1, row: p.row + contentY })),
  }));
  const rects = (result.rects ?? []).map(r => ({ ...r, col: r.col + 1, row: r.row + contentY }));
  const texts = (result.texts ?? []).map(t => ({ ...t, col: t.col + 1, row: t.row + contentY }));
  for (const c of result.colors ?? []) {
    colors.push({ ...c, col: c.col + 1, row: c.row + contentY });
  }
  for (const cl of result.clicks ?? []) {
    clicks.push({ ...cl, x: cl.x + 1, y: cl.y + contentY });
  }

  // footer
  const footer = `${cols}x${rows}`;
  grid.write(g, 1, rows - 1, footer);
  for (let i = 0; i < footer.length; i++) {
    colors.push({ col: 1 + i, row: rows - 1, color: palette.GRAY });
  }

  return { grid: g, clicks, colors, vectors, rects, texts };
};

// route clicks
app.screen.onClick((col, row) => {
  // scene tab bar
  if (row === 0 && col >= title.length + 3) {
    sceneTabs.hitTest(col - (title.length + 3), 0);
    app.update();
    return;
  }
  // delegate to scene
  const contentY = 2;
  if (row >= contentY) {
    scenes[activeScene].click?.(col - 1, row - contentY, col - 1, row - contentY);
    app.update();
  }
});

const title = 'GRATICULE';

// keyboard
app.onKey((e) => {
  scenes[activeScene].key?.(e);
});

// start first scene
scenes[activeScene].start(() => app.update());
app.start();

// HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    scenes[activeScene].stop();
    app.destroy();
  });
}
