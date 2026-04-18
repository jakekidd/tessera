# grid

Utility module for creating and manipulating character grids.

```ts
import { grid } from 'graticule'
```

## Functions

### create()

```ts
grid.create(width: number, height: number, fill?: string): CharGrid
```

Create an empty grid. Default fill is `' '` (space).

### write()

```ts
grid.write(grid: CharGrid, x: number, y: number, text: string): void
```

Write a string at position (x, y). Out-of-bounds characters are silently clipped.

### writeLines()

```ts
grid.writeLines(grid: CharGrid, x: number, y: number, lines: string[]): void
```

Write multiple lines starting at (x, y).

### overlay()

```ts
grid.overlay(target: CharGrid, source: CharGrid, x: number, y: number): void
```

Overlay `source` onto `target` at position (x, y). Characters from source overwrite target.

### fillRect()

```ts
grid.fillRect(grid: CharGrid, x: number, y: number, w: number, h: number, char?: string): void
```

Fill a rectangular region with a character (default: space).

### toString()

```ts
grid.toString(grid: CharGrid): string
```

Convert grid to a single string (rows joined by newlines).

### clone()

```ts
grid.clone(grid: CharGrid): CharGrid
```

Deep-copy a grid.

### dimensions()

```ts
grid.dimensions(grid: CharGrid): { width: number; height: number }
```

Get the width and height of a grid.

### wordWrap()

```ts
grid.wordWrap(text: string, width: number): string[]
```

Word-wrap text to fit within `width` characters. Returns an array of lines.

### truncate()

```ts
grid.truncate(text: string, width: number): string
```

Truncate text with `...` if it exceeds `width`.

### center()

```ts
grid.center(text: string, width: number): string
```

Center-pad text within `width` characters.

### padLeft()

```ts
grid.padLeft(text: string, width: number): string
```

Left-pad text to `width` characters.

### padRight()

```ts
grid.padRight(text: string, width: number): string
```

Right-pad text to `width` characters.

### collectOverlays()

```ts
grid.collectOverlays(
  component: Component,
  offsetX: number,
  offsetY: number,
): { vectors, rects, texts, colors, clicks }
```

Collect vector overlays from a component (and its children, if it's a layout container) with coordinate offsets applied. Used after rendering a component tree that contains `LineGraph`, `BarGraph`, or other components with overlays.

```ts
const layout = new Row([new LineGraph(series), sidebar])
grid.overlay(g, layout.render(w, h), x, y)
const overlays = grid.collectOverlays(layout, x, y)
return { grid: g, ...overlays }
```
