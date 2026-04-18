# Grid Utilities

The `grid` module provides functions for creating and manipulating character grids.

```ts
import { grid } from 'graticule'
```

## Creating Grids

```ts
// empty grid filled with spaces
const g = grid.create(80, 24)

// custom fill character
const g = grid.create(80, 24, '.')
```

## Writing Text

```ts
// write a string at position (x, y)
grid.write(g, 0, 0, 'Hello')

// write multiple lines
grid.writeLines(g, 0, 0, ['Line 1', 'Line 2', 'Line 3'])
```

Out-of-bounds writes are silently clipped.

## Composing Grids

```ts
// overlay one grid onto another at position (x, y)
grid.overlay(target, source, 5, 2)
```

This is how components are placed into the main grid. Characters from `source` overwrite `target` at the given offset.

## Fill

```ts
// fill a rectangular region
grid.fillRect(g, 10, 5, 20, 10, '#')
```

## Text Helpers

```ts
// word-wrap to fit width
grid.wordWrap('long text here...', 20)  // => string[]

// truncate with ellipsis
grid.truncate('Hello World', 8)  // => 'Hello...'

// center text in width
grid.center('Hi', 10)  // => '    Hi    '

// pad left / right
grid.padLeft('42', 6)   // => '    42'
grid.padRight('Hi', 6)  // => 'Hi    '
```

## Inspection

```ts
// convert grid to string
grid.toString(g)  // joined with newlines

// get dimensions
grid.dimensions(g)  // => { width: 80, height: 24 }

// clone a grid
const copy = grid.clone(g)
```
