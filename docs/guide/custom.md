# Custom Components

Build your own components by implementing the `Component` interface.

## The Component Interface

```ts
interface Component {
  render(width: number, height: number): CharGrid
  bounds?: Bounds
  onClick?(): void
  hitTest?(x: number, y: number): boolean
}
```

Only `render()` is required. The optional members enable interactivity.

## Basic Example

A progress bar component:

```ts
import { grid } from 'graticule'
import type { CharGrid, Component } from 'graticule'

class ProgressBar implements Component {
  private value: number  // 0-100

  constructor(value: number) {
    this.value = Math.max(0, Math.min(100, value))
  }

  render(width: number, height: number): CharGrid {
    const g = grid.create(width, height)
    const barW = width - 2  // room for [ ]
    const filled = Math.round((this.value / 100) * barW)
    const bar = '[' + '#'.repeat(filled) + '-'.repeat(barW - filled) + ']'
    grid.write(g, 0, 0, bar)
    return g
  }

  set(value: number): void {
    this.value = Math.max(0, Math.min(100, value))
  }
}
```

## Composing with Built-ins

Custom components can use built-in components internally:

```ts
import { Box, Text, Row, Col, grid } from 'graticule'
import type { CharGrid, Component } from 'graticule'

class StatusCard implements Component {
  private title: string
  private status: string
  private detail: string

  constructor(title: string, status: string, detail: string) {
    this.title = title
    this.status = status
    this.detail = detail
  }

  render(width: number, height: number): CharGrid {
    const content = new Col([
      { component: new Text(this.status, 'center'), height: 1 },
      { component: new Text(this.detail), flex: 1 },
    ])
    const box = new Box(this.title, content)
    return box.render(width, height)
  }
}
```

## Interactive Custom Components

Add `onClick` and `hitTest` for click handling, and expose `bounds` so layout containers can set your position:

```ts
import type { CharGrid, Component, Bounds } from 'graticule'

class Toggle implements Component {
  public bounds?: Bounds
  private on: boolean
  private handler?: (on: boolean) => void

  constructor(on: boolean, handler?: (on: boolean) => void) {
    this.on = on
    this.handler = handler
  }

  render(width: number, height: number): CharGrid {
    const g = grid.create(width, height)
    const text = this.on ? '[*] ON ' : '[ ] OFF'
    grid.write(g, 0, 0, text)
    return g
  }

  onClick(): void {
    this.on = !this.on
    this.handler?.(this.on)
  }

  hitTest(x: number, y: number): boolean {
    if (!this.bounds) return false
    return x >= this.bounds.x && x < this.bounds.x + this.bounds.w &&
           y >= this.bounds.y && y < this.bounds.y + this.bounds.h
  }
}
```

## Using Custom Components

Custom components work anywhere a built-in component works:

```ts
const progress = new ProgressBar(75)
const card = new StatusCard('Server', 'ONLINE', 'Running 14h')

const layout = new Row([
  new Box('Progress', progress),
  card,
])

// in render function
grid.overlay(g, layout.render(cols, rows), 0, 0)
```
