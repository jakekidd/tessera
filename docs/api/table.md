# Table

A bordered data table with configurable column widths and alignment.

## Constructor

```ts
new Table(columns: TableColumn[], data: string[][])
```

### TableColumn

```ts
interface TableColumn {
  header: string
  width?: number               // fixed width
  flex?: number                // flex factor (default: 1)
  align?: 'left' | 'center' | 'right'  // default: 'left'
}
```

## Methods

### render()

```ts
render(width: number, height: number): CharGrid
```

Renders a bordered table with header row, separator, and data rows. Uses single-line box-drawing characters. Columns are distributed with the same fixed/flex algorithm as Row.

### setData()

```ts
setData(data: string[][]): void
```

Replace the table data. Call `app.update()` afterward.

## Example

```ts
const columns = [
  { header: 'NAME', flex: 2 },
  { header: 'STATUS', width: 10, align: 'center' as const },
  { header: 'LATENCY', width: 8, align: 'right' as const },
]

const data = [
  ['api-gateway', 'ONLINE', '12ms'],
  ['auth-service', 'ONLINE', '8ms'],
  ['cache-layer', 'DEGRADED', '45ms'],
]

const table = new Table(columns, data)

// inside a box
new Box('Services', table)
```
