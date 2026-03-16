# BarChart

A vertical bar chart with Y-axis labels and X-axis labels.

## Constructor

```ts
new BarChart(data: ChartData, options?: BarChartOptions)
```

### ChartData

```ts
interface ChartData {
  labels: string[]
  values: number[]
}
```

### BarChartOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fill` | `boolean` | `false` | Fill bars without gaps (area chart look) |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders a bar chart with:
- Y-axis with tick marks (up to 5 ticks)
- Bars using `\u2588` (full block) character
- X-axis labels (date labels `YYYY-MM-DD` auto-shortened to `MM/DD`)
- Auto-scaled to max value

### setData()

```ts
setData(data: ChartData): void
```

Replace the chart data. Call `app.update()` afterward.

## Examples

```ts
// basic chart
new BarChart({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  values: [10, 25, 15, 30, 20],
})

// filled (no gaps between bars)
new BarChart(data, { fill: true })

// inside a box
new Box('Revenue', new BarChart(data))

// live-updating chart
const chart = new BarChart(data)
setInterval(() => {
  data.values.push(Math.random() * 100)
  data.labels.push(String(data.values.length))
  if (data.values.length > 30) {
    data.values.shift()
    data.labels.shift()
  }
  chart.setData(data)
  app.update()
}, 500)
```
