# Button

A clickable label rendered as `[ LABEL ]`.

## Constructor

```ts
new Button(label: string, handler?: () => void)
```

| Param | Type | Description |
|-------|------|-------------|
| `label` | `string` | Button text (uppercased in render) |
| `handler` | `() => void` | Click callback |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `bounds` | `Bounds \| undefined` | Set by layout containers (Row/Col) |
| `hovered` | `boolean` | Whether the button is being hovered |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders `[ LABEL ]` vertically centered in the available space.

### naturalWidth()

```ts
naturalWidth(): number
```

Returns the minimum width needed: `label.length + 4`.

### onClick()

```ts
onClick(): void
```

Called when the button is clicked. Invokes the handler.

### hitTest()

```ts
hitTest(x: number, y: number): boolean
```

Returns `true` if (x, y) is within the button's bounds.

### setLabel()

```ts
setLabel(label: string): void
```

### setHandler()

```ts
setHandler(handler: () => void): void
```

## Example

```ts
const btn = new Button('Submit', () => {
  console.log('form submitted')
})

// use in a Row
new Row([new Text('Ready?'), btn])
```
