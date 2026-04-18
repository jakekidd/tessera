# palette

Named color constants for consistent styling.

```ts
import { palette } from 'graticule'
```

## Colors

| Constant | Value | Usage |
|----------|-------|-------|
| `palette.BLUE` | `#4169E1` | Headers, highlights |
| `palette.GREEN` | `#22c55e` | Success, healthy |
| `palette.YELLOW` | `#facc15` | Warning, degraded |
| `palette.RED` | `#ff0000` | Error, critical |
| `palette.GRAY` | `#666666` | Muted text, footers |
| `palette.ORANGE` | `#fb923c` | Accents |
| `palette.PURPLE` | `#a855f7` | Accents |
| `palette.CYAN` | `#06b6d4` | Data, charts |

## UI Chrome

| Constant | Value | Usage |
|----------|-------|-------|
| `palette.AXIS` | `#444444` | Chart axes |
| `palette.HINT` | `#555555` | Subtle hints |

## Screen Defaults

| Constant | Value | Usage |
|----------|-------|-------|
| `palette.FG` | `#c0c0c0` | Default text color |
| `palette.BG` | `#0a0a0a` | Default background |

## Example

```ts
const colors: ColorCell[] = []

// color a header blue
for (let i = 0; i < title.length; i++) {
  colors.push({ col: i, row: 0, color: palette.BLUE })
}

// color status text by health
const color = status === 'OK' ? palette.GREEN : palette.RED
```
