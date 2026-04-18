# graticule()

Convenience function to create an `App` instance from a canvas element.

## Signature

```ts
function graticule(canvas: HTMLCanvasElement, config?: AppConfig): App
```

## Parameters

| Param | Type | Description |
|-------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The canvas element to render to |
| `config` | `AppConfig` | Optional configuration |

### AppConfig

Extends `ScreenConfig`:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font` | `string` | `'SF Mono, IBM Plex Mono, monospace'` | Monospace font family |
| `fontSize` | `number` | `14` | Font size in pixels |
| `fg` | `string` | `'#c0c0c0'` | Default foreground color |
| `bg` | `string` | `'#0a0a0a'` | Background color |
| `lineHeight` | `number` | `1.2` | Line height multiplier |
| `hover` | `boolean` | `true` | Enable hover highlighting |
| `hoverColor` | `string` | `'#ffffff'` | Hover highlight color |

## Returns

An `App` instance.

## Example

```ts
import { graticule } from 'graticule'

const app = graticule(document.getElementById('screen'), {
  fontSize: 16,
  bg: '#000000',
})

app.render = (cols, rows) => {
  // ...
  return { grid: g }
}

app.start()
```
