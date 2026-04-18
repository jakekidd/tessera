# Examples

## Live Demo

Interactive demo with four scenes: Basics, Dashboard, Streaming, and Component Catalog. Click the tabs at the top to switch between them.

<div style="width:100%;height:500px;border:1px solid #333;border-radius:4px;overflow:hidden;margin:16px 0">
  <iframe src="/graticule/demo/" style="width:100%;height:100%;border:none"></iframe>
</div>

[Open fullscreen](/graticule/demo/){target="_blank"}

### Basics

Tabbed interface with overview (side-by-side boxes), ASCII bar chart, and data table. Core components and click routing.

### Dashboard

Multi-panel monitoring dashboard with metric boxes, vector bar graph, service table, and scrolling log. Auto-refreshes every 2s.

### Streaming

Realtime data streaming with vector line graph, live statistics, and event log. Updates every 500ms with pulsing status indicator.

### Catalog

Component catalog with tabs for each component type: Text, Box, Layout, Table, Chart, Graph, Interactive. Keyboard navigation with arrow keys.

---

## Sandbox

Write graticule code on the left, see it render on the right. Choose from pre-written samples or write your own. Press **Ctrl+Enter** to run.

<div style="width:100%;height:500px;border:1px solid #333;border-radius:4px;overflow:hidden;margin:16px 0">
  <iframe src="/graticule/demo/sandbox.html" style="width:100%;height:100%;border:none"></iframe>
</div>

[Open fullscreen](/graticule/demo/sandbox.html){target="_blank"}

### Available Samples

| Sample | What it shows |
|--------|--------------|
| Hello World | Minimal app with a Box and Text |
| Layout | Col/Row nesting with sidebar layout |
| Table | Data table with column config |
| Line Graph | Multi-series vector LineGraph |
| Bar Graph | Grouped vector BarGraph |
| Live Counter | Keyboard interactivity |
| Box Styles | All four BoxChars border styles |

### API Available in Sandbox

All graticule exports are in scope: `app`, `grid`, `Box`, `Row`, `Col`, `Text`, `Table`, `BarChart`, `LineGraph`, `BarGraph`, `Tabs`, `Button`, `palette`, `BoxChars`. `setInterval` is tracked for automatic cleanup.
