# Col

Vertical flex layout container. Distributes available height among children.

## Constructor

```ts
new Col(children: (Component | ColChild)[])
```

Plain `Component` values are wrapped as `{ component, flex: 1 }`.

### ColChild

```ts
interface ColChild {
  component: Component
  height?: number  // fixed height in rows
  flex?: number    // flex factor (default: 1)
}
```

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Same algorithm as Row but for vertical space. Fixed-height children first, then flex distribution.

## Examples

```ts
// header + body + footer
new Col([
  { component: header, height: 3 },
  { component: body, flex: 1 },
  { component: footer, height: 1 },
])

// equal split
new Col([panelA, panelB])
```
