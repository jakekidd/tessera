# Getting Started

Graticule is a browser-canvas ASCII component framework. It renders a character grid to an HTML5 canvas, giving you the retro terminal aesthetic with modern browser capabilities.

## Install

```bash
npm install graticule
```

Or clone the repo and import directly from source:

```ts
import { graticule, grid, Box, Text } from 'graticule'
```

## Minimal Example

```html
<canvas id="screen" style="width:100%;height:100%"></canvas>
<script type="module">
import { graticule, grid, Box, Text } from 'graticule'

const app = graticule(document.getElementById('screen'), { fontSize: 14 })

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  const box = new Box('Hello', new Text('Welcome to Graticule'))
  grid.overlay(g, box.render(cols, rows), 0, 0)
  return { grid: g }
}

app.start()
</script>
```

## Core Concepts

### CharGrid

The fundamental data structure: a 2D array of single characters (`string[][]`). Every component's `render()` method returns a CharGrid. The grid utilities module provides functions to create, write to, and compose grids.

```ts
type CharGrid = string[][]
```

### Component

All built-in UI elements implement the `Component` interface:

```ts
interface Component {
  render(width: number, height: number): CharGrid
  bounds?: Bounds
  onClick?(): void
  hitTest?(x: number, y: number): boolean
}
```

The only required method is `render()`. Components receive the available space and return a character grid that fills it.

### RenderResult

Your app's render function returns a `RenderResult`:

```ts
interface RenderResult {
  grid: CharGrid
  clicks?: ClickRegion[]
  colors?: ColorCell[]
  vectors?: VectorLine[]
  texts?: VectorText[]
}
```

- `grid` - the character data to draw
- `clicks` - interactive click regions
- `colors` - per-cell color overrides
- `vectors` - canvas-drawn line overlays (for glow effects)
- `texts` - canvas-drawn text labels

## Next Steps

- [App Lifecycle](./app) - how the render loop works
- [Components](./components) - built-in components overview
- [Layout](./layout) - Row/Col flex system
