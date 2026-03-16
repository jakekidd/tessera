import {
  tessera, grid, Box, Row, Col, Text, Table, BarChart,
  LineGraph, BarGraph, Button, Tabs, palette, BoxChars,
} from '../src/index.js';
import type { App } from '../src/index.js';

const codeEl = document.getElementById('code') as HTMLTextAreaElement;
const sampleEl = document.getElementById('samples') as HTMLSelectElement;
const runBtn = document.getElementById('run') as HTMLButtonElement;
const canvas = document.getElementById('screen') as HTMLCanvasElement;
const errorEl = document.getElementById('error') as HTMLDivElement;

// -- samples --

const samples: Record<string, string> = {
  'Hello World': `app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const box = new Box('Hello', new Text('Welcome to Tessera!\\n\\nEdit this code and click RUN.'))
  grid.overlay(g, box.render(cols, rows), 0, 0)
  return { grid: g }
}
app.start()`,

  'Layout': `app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const colors = []

  const layout = new Col([
    { component: new Box('Header', new Text('Tessera Layout Demo', 'center')), height: 5 },
    {
      component: new Row([
        { component: new Box('Sidebar', new Text('Navigation\\n\\n- Home\\n- About\\n- Contact')), width: 24 },
        { component: new Box('Main', new Text('This demonstrates the flex layout system.\\n\\nRow and Col containers distribute space\\namong children using fixed sizes and\\nflex factors, just like CSS flexbox.')), flex: 1 },
      ]),
      flex: 1,
    },
    { component: new Box('Footer', new Text('Status: OK', 'center')), height: 3 },
  ])

  grid.overlay(g, layout.render(cols, rows), 0, 0)
  return { grid: g, colors }
}
app.start()`,

  'Table': `const columns = [
  { header: 'COMPONENT', flex: 2 },
  { header: 'TYPE', width: 12, align: 'center' },
  { header: 'INTERACTIVE', width: 14, align: 'center' },
]

const data = [
  ['Text', 'Display', 'No'],
  ['Box', 'Container', 'No'],
  ['Button', 'Input', 'Yes'],
  ['Tabs', 'Navigation', 'Yes'],
  ['Table', 'Data', 'No'],
  ['BarChart', 'ASCII Chart', 'No'],
  ['LineGraph', 'Vector Chart', 'No'],
  ['BarGraph', 'Vector Chart', 'No'],
  ['Row', 'Layout', 'No'],
  ['Col', 'Layout', 'No'],
]

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  grid.write(g, 1, 0, 'TESSERA COMPONENTS')
  const table = new Box('Component Registry', new Table(columns, data))
  grid.overlay(g, table.render(cols - 2, rows - 2), 1, 2)
  const colors = []
  for (let i = 0; i < 18; i++) colors.push({ col: 1 + i, row: 0, color: palette.BLUE })
  return { grid: g, colors }
}
app.start()`,

  'Line Graph': `const series = [
  { label: 'Revenue', values: [10, 25, 18, 42, 35, 55, 48, 62, 58, 70, 65, 80], color: palette.BLUE },
  { label: 'Costs', values: [8, 15, 12, 28, 22, 35, 30, 40, 38, 45, 42, 50], color: palette.RED },
  { label: 'Profit', values: [2, 10, 6, 14, 13, 20, 18, 22, 20, 25, 23, 30], color: palette.GREEN },
]

const chart = new LineGraph(series, {
  xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  gridLines: true,
  glow: 6,
})

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const box = new Box('Annual Performance', chart)
  grid.overlay(g, box.render(cols, rows), 0, 0)
  const ov = grid.collectOverlays(box, 0, 0)
  return { grid: g, ...ov }
}
app.start()`,

  'Bar Graph': `const series = [
  { label: '2024', values: [120, 95, 140, 85, 110], color: palette.CYAN },
  { label: '2025', values: [150, 110, 130, 100, 145], color: palette.PURPLE },
]

const chart = new BarGraph(series, {
  xLabels: ['North', 'South', 'East', 'West', 'Central'],
  valueLabels: true,
  gridLines: true,
  glow: 4,
})

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const box = new Box('Regional Sales', chart)
  grid.overlay(g, box.render(cols, rows), 0, 0)
  const ov = grid.collectOverlays(box, 0, 0)
  return { grid: g, ...ov }
}
app.start()`,

  'Live Counter': `let count = 0

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const colors = []

  grid.write(g, 1, 1, 'LIVE COUNTER')
  for (let i = 0; i < 12; i++) colors.push({ col: 1 + i, row: 1, color: palette.BLUE })

  const display = new Box('Count', new Text(String(count), 'center'))
  grid.overlay(g, display.render(20, 5), 1, 3)

  grid.write(g, 1, 9, 'Press SPACE to increment')
  for (let i = 0; i < 24; i++) colors.push({ col: 1 + i, row: 9, color: palette.GRAY })

  return { grid: g, colors }
}

app.onKey((e) => {
  if (e.key === ' ') {
    count++
    app.update()
  }
})

app.start()`,

  'Box Styles': `app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const w = Math.min(36, Math.floor((cols - 4) / 2))
  const h = 6

  const styles = [
    ['single (default)', BoxChars.single],
    ['double', BoxChars.double],
    ['rounded', BoxChars.rounded],
    ['ascii', BoxChars.ascii],
  ]

  for (let i = 0; i < styles.length; i++) {
    const x = (i % 2) * (w + 2) + 1
    const y = Math.floor(i / 2) * (h + 1)
    const box = new Box(styles[i][0], new Text('Box content here'), { chars: styles[i][1] })
    grid.overlay(g, box.render(w, h), x, y)
  }

  return { grid: g }
}
app.start()`,
};

// populate dropdown
for (const name of Object.keys(samples)) {
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = name;
  sampleEl.appendChild(opt);
}

// -- execution --

let currentApp: App | null = null;
let currentIntervals: number[] = [];

// patch setInterval to track for cleanup
const origSetInterval = window.setInterval.bind(window);
const origClearInterval = window.clearInterval.bind(window);

function execute(code: string): void {
  errorEl.style.display = 'none';

  // cleanup previous
  if (currentApp) {
    currentApp.destroy();
    currentApp = null;
  }
  for (const id of currentIntervals) origClearInterval(id);
  currentIntervals = [];

  // track intervals created by user code
  const trackedSetInterval = (fn: Function, ms: number) => {
    const id = origSetInterval(fn as any, ms);
    currentIntervals.push(id);
    return id;
  };

  try {
    const app = tessera(canvas, { fontSize: 14 });
    currentApp = app;

    const fn = new Function(
      'app', 'tessera', 'grid', 'Box', 'Row', 'Col', 'Text', 'Table',
      'BarChart', 'LineGraph', 'BarGraph', 'Tabs', 'Button', 'palette', 'BoxChars',
      'setInterval', 'clearInterval',
      code,
    );

    fn(
      app, tessera, grid, Box, Row, Col, Text, Table,
      BarChart, LineGraph, BarGraph, Tabs, Button, palette, BoxChars,
      trackedSetInterval, origClearInterval,
    );
  } catch (e: any) {
    errorEl.textContent = e.message;
    errorEl.style.display = 'block';
  }
}

// -- events --

function loadSample(name: string): void {
  codeEl.value = samples[name] ?? '';
  execute(codeEl.value);
}

sampleEl.addEventListener('change', () => loadSample(sampleEl.value));
runBtn.addEventListener('click', () => execute(codeEl.value));

// ctrl+enter to run
codeEl.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    execute(codeEl.value);
  }
  // tab key inserts spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = codeEl.selectionStart;
    const end = codeEl.selectionEnd;
    codeEl.value = codeEl.value.substring(0, start) + '  ' + codeEl.value.substring(end);
    codeEl.selectionStart = codeEl.selectionEnd = start + 2;
  }
});

// load first sample
loadSample(Object.keys(samples)[0]);

// HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (currentApp) currentApp.destroy();
    for (const id of currentIntervals) origClearInterval(id);
  });
}
