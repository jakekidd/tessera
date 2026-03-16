# Box

A bordered container with an optional title and child component.

## Constructor

```ts
new Box(title: string | null, child: Component | null, options?: BoxOptions)
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string \| null` | | Title shown in the top border. `null` for no title |
| `child` | `Component \| null` | | Child component rendered inside the box |
| `options` | `BoxOptions` | `{}` | Additional options |

### BoxOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `chars` | `BoxCharSet` | `BoxChars.single` | Border character set |
| `padding` | `number` | `1` | Inner padding (characters) |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders the box border and child. The child receives `(width - 2 - padding*2, height - 2 - padding*2)`.

### setTitle()

```ts
setTitle(title: string | null): void
```

### setChild()

```ts
setChild(child: Component | null): void
```

## Examples

```ts
// basic box
new Box('Status', new Text('All systems go'))

// no title
new Box(null, new Text('Untitled content'))

// double border
new Box('Alert', child, { chars: BoxChars.double })

// extra padding
new Box('Spacious', child, { padding: 3 })
```
