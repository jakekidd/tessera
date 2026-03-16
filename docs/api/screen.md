# Screen

Low-level canvas renderer. Handles font measurement, DPR scaling, character grid drawing, and input events. Usually accessed via `app.screen`.

## Constructor

```ts
new Screen(canvas: HTMLCanvasElement, config?: ScreenConfig)
```

### ScreenConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font` | `string` | `'SF Mono, IBM Plex Mono, monospace'` | Monospace font family |
| `fontSize` | `number` | `14` | Font size in pixels |
| `fg` | `string` | `'#c0c0c0'` | Default foreground color |
| `bg` | `string` | `'#0a0a0a'` | Background color |
| `lineHeight` | `number` | `1.2` | Line height multiplier |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `charWidth` | `number` | Measured width of a single character in pixels |
| `charHeight` | `number` | Character cell height (fontSize * lineHeight) |
| `cols` | `number` | Number of columns that fit the canvas |
| `rows` | `number` | Number of rows that fit the canvas |
| `mouseCol` | `number` | Current mouse column (-1 if outside) |
| `mouseRow` | `number` | Current mouse row (-1 if outside) |

## Methods

### draw()

```ts
draw(
  grid: CharGrid,
  colorAt?: (col: number, row: number) => string | undefined,
  glowAt?: (col: number, row: number) => { color: string; blur: number } | undefined
): void
```

Draw a character grid to the canvas. Optional callbacks provide per-cell color and glow overrides.

### drawVectors()

```ts
drawVectors(lines: VectorLine[]): void
```

Draw vector line overlays with optional CRT-style glow.

### drawTexts()

```ts
drawTexts(texts: VectorText[]): void
```

Draw canvas text labels.

### getDimensions()

```ts
getDimensions(): { cols: number; rows: number }
```

### resize()

```ts
resize(): void
```

Recalculate canvas dimensions (called automatically on window resize).

### setCursor()

```ts
setCursor(cursor: string): void
```

Set the canvas element's CSS cursor.

### setFont() / getFont()

```ts
setFont(font: string): void
getFont(): string
```

Change the font family. Triggers remeasurement and resize.

### Event Handlers

```ts
onClick(handler: (col: number, row: number) => void): void
onMouseMove(handler: (col: number, row: number) => void): void
onResize(handler: () => void): void
```
