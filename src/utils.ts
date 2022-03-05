export const make2DArrayOfObject = <T extends {}>(
  rows: number,
  cols: number,
  fill: T
): T[][] => {
  return [...Array(rows).keys()].map(() =>
    [...Array(cols).keys()].map(() => Object.assign({}, fill))
  )
}

export const sumColSpan = <T extends { colSpan: string }>(row: T[]): number => {
  return row.reduce((acc, val) => acc + parseInt(val.colSpan), 0)
}
