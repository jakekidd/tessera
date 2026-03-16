# Styling

Tessera provides several styling mechanisms: per-cell colors, box-drawing character sets, the palette module, and canvas-level vector overlays.

## Per-Cell Colors

Return `ColorCell` entries in your `RenderResult` to override the color of specific characters:

```ts
import { palette } from 'tessera'

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  grid.write(g, 0, 0, 'ERROR: something broke')

  const colors = []
  for (let i = 0; i < 5; i++) {
    colors.push({ col: i, row: 0, color: palette.RED })
  }

  return { grid: g, colors }
}
```

## Palette

The `palette` module exports named color constants:

```ts
import { palette } from 'tessera'

palette.BLUE    // '#4169E1'
palette.GREEN   // '#22c55e'
palette.YELLOW  // '#facc15'
palette.RED     // '#ff0000'
palette.GRAY    // '#666666'
palette.ORANGE  // '#fb923c'
palette.PURPLE  // '#a855f7'
palette.CYAN    // '#06b6d4'

// UI chrome
palette.AXIS    // '#444444'
palette.HINT    // '#555555'

// Screen defaults
palette.FG      // '#c0c0c0'
palette.BG      // '#0a0a0a'
```

## Box Characters

Four built-in box-drawing character sets:

```ts
import { BoxChars } from 'tessera'

BoxChars.single   // ┌─┐│└─┘  (default)
BoxChars.double   // ╔═╗║╚═╝
BoxChars.rounded  // ╭─╮│╰─╯
BoxChars.ascii    // +-+|+-+
```

Pass to Box via options:

```ts
new Box('Title', child, { chars: BoxChars.double })
```

## VectorLine Overlays

Draw smooth lines on the canvas, rendered on top of the character grid:

```ts
app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  return {
    grid: g,
    vectors: [{
      points: [
        { col: 5, row: 10 },
        { col: 20, row: 3 },
        { col: 40, row: 8 },
      ],
      color: palette.CYAN,
      width: 1.5,    // line width (default: 1.5)
      glow: 6,       // glow blur radius (default: 6, 0 to disable)
      cap: 'round',  // 'round' or 'butt' (default: 'round')
    }],
  }
}
```

## VectorText

Draw canvas text labels (not part of the ASCII grid):

```ts
return {
  grid: g,
  texts: [{
    col: 10,
    row: 5,
    text: 'Label',
    color: palette.BLUE,
    fontSize: 12,         // optional, defaults to screen fontSize
    align: 'center',      // 'left' | 'center' | 'right'
    baseline: 'bottom',   // 'top' | 'middle' | 'bottom'
  }],
}
```
