# Layout

Graticule uses `Row` and `Col` containers for flex-style layout within the character grid.

## Row (Horizontal)

`Row` distributes its available width among children, similar to CSS `flex-direction: row`.

```ts
import { Row, Box, Text } from 'graticule'

// pass plain components for equal flex (each gets flex: 1)
const row = new Row([
  new Box('Left', new Text('A')),
  new Box('Right', new Text('B')),
])
```

### Fixed vs Flex

Children can have a fixed `width` or a `flex` factor:

```ts
new Row([
  { component: sidebar, width: 25 },    // exactly 25 characters
  { component: main, flex: 2 },          // 2 parts of remaining space
  { component: panel, flex: 1 },         // 1 part of remaining space
])
```

Fixed-width children are allocated first. Remaining space is divided among flex children proportionally.

## Col (Vertical)

`Col` distributes available height, same API as Row:

```ts
import { Col, Box, Text } from 'graticule'

new Col([
  { component: header, height: 3 },   // exactly 3 rows
  { component: body, flex: 1 },        // fills remaining height
  { component: footer, height: 1 },   // exactly 1 row
])
```

## Nesting

Row and Col can be nested for complex layouts:

```ts
// classic app layout: header + (sidebar | main)
new Col([
  { component: new Box('Header', new Text('App')), height: 5 },
  {
    component: new Row([
      { component: new Box('Nav', navContent), width: 20 },
      { component: new Box('Main', mainContent), flex: 1 },
    ]),
    flex: 1,
  },
])
```

## Manual Composition with grid.overlay

For full control, skip Row/Col and place grids manually:

```ts
app.render = (cols, rows) => {
  const g = grid.create(cols, rows)

  // place a box at position (5, 2) with size 40x10
  const box = new Box('Panel', new Text('Content'))
  grid.overlay(g, box.render(40, 10), 5, 2)

  return { grid: g }
}
```

This is useful for absolute positioning, overlapping elements, or custom layout logic.
