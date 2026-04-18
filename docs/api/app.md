# App

Top-level application container. Owns the render loop, routes clicks, tracks hover, and re-renders on resize.

## Constructor

```ts
new App(canvas: HTMLCanvasElement, config?: AppConfig)
```

Usually created via [`graticule()`](./graticule).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `screen` | `Screen` | The underlying Screen instance |
| `render` | `((cols, rows) => RenderResult) \| null` | User-supplied render function |

## Methods

### start()

```ts
start(): void
```

Perform the initial render. Call once after setting up the render function.

### update()

```ts
update(): void
```

Trigger a re-render. Call whenever state changes.

### onKey()

```ts
onKey(handler: (e: KeyboardEvent) => void): void
```

Listen for keyboard events. Replaces any previous handler.

### dump()

```ts
dump(): string
```

Returns the last rendered grid as a string (rows joined by newlines).

### copy()

```ts
copy(): string
```

Returns the ASCII grid as text. Vector chart areas (LineGraph, BarGraph) appear as blank space since their visual content is canvas-rendered, not part of the character grid. ASCII legends are preserved.

### destroy()

```ts
destroy(): void
```

Clean up event listeners.

## Example

```ts
const app = graticule(canvas, { fontSize: 14 })

let count = 0

app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  grid.write(g, 0, 0, `Count: ${count}`)
  return { grid: g }
}

app.onKey((e) => {
  if (e.key === ' ') { count++; app.update() }
})

app.start()
```
