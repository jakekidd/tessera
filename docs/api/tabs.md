# Tabs

A horizontal tab bar with click-based selection.

## Constructor

```ts
new Tabs(items: string[], active?: number, onChange?: (index: number) => void)
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `string[]` | | Tab labels |
| `active` | `number` | `0` | Initially active tab index |
| `onChange` | `(index: number) => void` | | Called when active tab changes |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `bounds` | `Bounds \| undefined` | Set by layout containers |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders tabs horizontally. Active tab: `[LABEL]`, inactive: ` LABEL `.

### hitTest()

```ts
hitTest(x: number, y: number): boolean
```

Check if (x, y) hits a tab. If it hits a different tab, updates the active index and calls `onChange`. Returns `true` if a tab was hit.

### getActive()

```ts
getActive(): number
```

### setActive()

```ts
setActive(index: number): void
```

### setItems()

```ts
setItems(items: string[]): void
```

Replace the tab labels. Clamps active index if needed.

## Example

```ts
let activeTab = 0
const tabs = new Tabs(['HOME', 'DATA', 'SETTINGS'], 0, (i) => {
  activeTab = i
  app.update()
})

// route clicks
app.screen.onClick((col, row) => {
  if (row === 2) {
    tabs.hitTest(col, 0)
    app.update()
  }
})
```
