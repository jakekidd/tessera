# BarGraph

A vector-rendered bar chart with filled rectangles. Bars, axes, and labels are drawn as canvas overlays. The legend is rendered on the ASCII grid. Supports multiple series (grouped bars).

## Constructor

```ts
new BarGraph(series: Series[], options?: BarGraphOptions)
```

### Series

```ts
interface Series {
  label: string
  values: number[]
  color: string
}
```

Multiple series produce grouped bars (side-by-side within each x position).

### BarGraphOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `xLabels` | `string[]` | Index numbers | X-axis labels |
| `yMin` | `number` | `0` | Minimum y value |
| `yMax` | `number` | Auto | Maximum y value |
| `yTicks` | `number` | `5` | Number of y-axis ticks |
| `legend` | `boolean` | `true` | Show ASCII legend |
| `legendPosition` | `'top' \| 'bottom'` | `'top'` | Legend placement |
| `glow` | `number` | `3` | Bar glow radius (0 to disable) |
| `valueLabels` | `boolean` | `false` | Show value above each bar |
| `gridLines` | `boolean` | `false` | Show horizontal grid lines |
| `barFill` | `number` | `0.8` | Bar fill ratio within slot (0-1) |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `overlays` | `ComponentOverlays` | Rects/vectors/texts/colors produced during render |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Returns an ASCII grid (mostly blank, with legend text). Populates `overlays` with `VectorRect` entries for bars, plus vectors for axes and texts for labels.

### setData()

```ts
setData(series: Series[]): void
```

## Example

```ts
// single series
const chart = new BarGraph([
  { label: 'Sales', values: [120, 95, 140, 85], color: palette.BLUE },
], {
  xLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
  valueLabels: true,
})

// multiple series (grouped)
const chart = new BarGraph([
  { label: '2024', values: [120, 95, 140], color: palette.BLUE },
  { label: '2025', values: [150, 110, 130], color: palette.CYAN },
], {
  xLabels: ['North', 'South', 'East'],
  gridLines: true,
})

// in a layout
const layout = new Box('Revenue', chart)
grid.overlay(g, layout.render(60, 20), 5, 3)
const overlays = grid.collectOverlays(layout, 5, 3)
return { grid: g, ...overlays }
```
