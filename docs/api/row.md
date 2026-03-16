# Row

Horizontal flex layout container. Distributes available width among children.

## Constructor

```ts
new Row(children: (Component | RowChild)[])
```

Plain `Component` values are wrapped as `{ component, flex: 1 }`.

### RowChild

```ts
interface RowChild {
  component: Component
  width?: number   // fixed width in characters
  flex?: number    // flex factor (default: 1)
}
```

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Allocates fixed-width children first, then divides remaining space proportionally among flex children. Each child is rendered with its allocated width and the full height.

## Layout Algorithm

1. Fixed-width children get their exact width (capped at remaining space)
2. Remaining space is divided by total flex: each child gets `(flex / totalFlex) * remaining`
3. Children are rendered left-to-right
4. Children with `bounds` property get their position set

## Examples

```ts
// equal split
new Row([boxA, boxB, boxC])

// sidebar + main
new Row([
  { component: sidebar, width: 30 },
  { component: main, flex: 1 },
])

// weighted flex
new Row([
  { component: wide, flex: 3 },
  { component: narrow, flex: 1 },
])
```
