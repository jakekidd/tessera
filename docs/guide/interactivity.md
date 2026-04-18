# Interactivity

Graticule supports mouse clicks, hover highlighting, and keyboard input.

## Click Regions

Register clickable areas in your `RenderResult`:

```ts
app.render = (cols, rows) => {
  const g = grid.create(cols, rows)
  grid.write(g, 5, 3, '[ CLICK ME ]')

  return {
    grid: g,
    clicks: [{
      x: 5, y: 3, w: 12, h: 1,
      handler: () => console.log('clicked!'),
      cursor: 'pointer',  // optional, default: 'pointer'
    }],
  }
}
```

The `App` automatically routes canvas click events to matching regions.

## Tabs Hit Testing

`Tabs` tracks the bounds of each tab label internally. Route clicks through `hitTest()`:

```ts
const tabs = new Tabs(['A', 'B', 'C'], 0, (index) => {
  activeTab = index
  app.update()
})

// in your click handler or screen.onClick
app.screen.onClick((col, row) => {
  if (row === tabRow) {
    tabs.hitTest(col - tabX, 0)
    app.update()
  }
})
```

## Button

Buttons expose `onClick()` and `hitTest()`:

```ts
const btn = new Button('Submit', () => {
  console.log('submitted')
})

// button.bounds is set by Row/Col during render
// use button.hitTest(x, y) to check clicks
```

## Keyboard

Listen for keyboard events via the App:

```ts
app.onKey((e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft': activeTab--; break
    case 'ArrowRight': activeTab++; break
    case 'Enter': submit(); break
  }
  app.update()
})
```

## Hover

Hover highlighting is enabled by default. The character under the cursor is drawn with the `hoverColor`:

```ts
const app = graticule(canvas, {
  hover: true,            // default
  hoverColor: '#ffffff',  // default
})
```

The cursor automatically changes to `pointer` when hovering over click regions.

Disable hover:

```ts
const app = graticule(canvas, { hover: false })
```
