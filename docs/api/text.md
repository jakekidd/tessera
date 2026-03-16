# Text

A component that renders a string with word-wrapping and alignment.

## Constructor

```ts
new Text(content: string, align?: 'left' | 'center' | 'right')
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `content` | `string` | | The text to display |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders the text into a grid, word-wrapping to fit `width`. Lines beyond `height` are clipped.

### set()

```ts
set(content: string): void
```

Update the text content. Call `app.update()` afterward to re-render.

## Examples

```ts
// simple text
new Text('Hello world')

// centered
new Text('Status: OK', 'center')

// multiline (use \n)
new Text('Line 1\nLine 2\nLine 3')

// inside a box
new Box('Title', new Text('Box content here'))
```
