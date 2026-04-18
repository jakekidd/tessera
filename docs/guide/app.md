# App Lifecycle

The `App` class manages the render loop, event routing, and canvas drawing.

## Creating an App

Use the `graticule()` convenience function:

```ts
import { graticule } from 'graticule'

const app = graticule(canvas, {
  fontSize: 14,     // font size in px (default: 14)
  font: 'SF Mono',  // monospace font family
  fg: '#c0c0c0',    // foreground color
  bg: '#0a0a0a',    // background color
  lineHeight: 1.2,  // line height multiplier
  hover: true,       // enable hover highlighting (default: true)
  hoverColor: '#ffffff', // hover highlight color
})
```

Or construct directly:

```ts
import { App } from 'graticule'
const app = new App(canvas, config)
```

## Render Function

Assign a render function that receives the terminal dimensions and returns a `RenderResult`:

```ts
app.render = (cols: number, rows: number): RenderResult => {
  const g = grid.create(cols, rows)
  // ... compose your UI ...
  return { grid: g, clicks: [], colors: [] }
}
```

The render function is called:
- On `app.start()` (initial render)
- On `app.update()` (manual re-render)
- On window resize (automatic)
- On mouse move (for hover updates)

## start()

Performs the initial render. Call this once after setting up your render function:

```ts
app.render = (cols, rows) => { /* ... */ }
app.start()
```

## update()

Trigger a re-render manually. Call this whenever your state changes:

```ts
let count = 0
setInterval(() => {
  count++
  app.update() // re-renders with new count
}, 1000)
```

## onKey()

Listen for keyboard events:

```ts
app.onKey((e: KeyboardEvent) => {
  if (e.key === 'q') console.log('quit')
})
```

Only one handler is active at a time. Calling `onKey()` again replaces the previous handler.

## destroy()

Clean up event listeners when done:

```ts
app.destroy()
```

## dump()

Get the last rendered grid as a string (useful for debugging):

```ts
console.log(app.dump())
```

## Screen Access

The underlying `Screen` instance is exposed for low-level access:

```ts
app.screen.onClick((col, row) => { /* ... */ })
app.screen.onResize(() => { /* ... */ })
const { cols, rows } = app.screen.getDimensions()
```
