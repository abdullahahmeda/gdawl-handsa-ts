import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react'
import ColorPreview from './ColorPreview'
import { ARABIC_DAYS, DayOfWeek } from './constants'
import Print from './icons/Print'
import { make2DArrayOfObject } from './utils'

interface Props {
  periods: number
  sections: number
  days: DayOfWeek[]
}

interface Cell {
  value: string
  colSpan: string
  background: string
}

interface CellIndex {
  r: number
  c: number
}

export default function Timetable ({
  periods,
  sections,
  days
}: Props): ReactElement {
  const ROWS = periods * days.length
  const COLUMNS = sections

  const cellValueInpuRef = useRef<HTMLInputElement | null>(null)

  const [data, setData] = useState<Cell[][]>(
    make2DArrayOfObject(ROWS, COLUMNS, {
      value: '',
      colSpan: '1',
      background: 'transparent'
    })
  )
  const [selectedCell, setSelectedCell] = useState<null | CellIndex>(null)

  useEffect(() => {
    if (selectedCell !== null && cellValueInpuRef.current !== null) {
      cellValueInpuRef.current.focus()
    }
  }, [selectedCell])

  const handleCellClick = (r: number, c: number): void => {
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setSelectedCell(null)
    } else {
      setSelectedCell({ r, c })
    }
  }

  const handleCellValueChange = (e: FormEvent<HTMLInputElement>): void => {
    if (selectedCell !== null) {
      const newData = data.concat()
      newData[selectedCell.r][selectedCell.c].value = e.currentTarget.value
      setData(newData)
    }
  }

  const handleCellColSpanChange = (e: FormEvent<HTMLSelectElement>): void => {
    if (selectedCell !== null) {
      const newData = data.concat()
      const rowWidth = parseInt(e.currentTarget.value)
      for (let i = selectedCell.c + 1; i < COLUMNS; i++) {
        if (i <= selectedCell.c + rowWidth - 1) {
          newData[selectedCell.r][i].colSpan = '0'
        } else newData[selectedCell.r][i].colSpan = '1'
      }
      newData[selectedCell.r][selectedCell.c].colSpan = e.currentTarget.value
      setData(newData)
    }
  }

  const updateCellBackground = (newBackground: string): void => {
    if (selectedCell !== null) {
      const newData = data.concat()
      newData[selectedCell.r][selectedCell.c].background = newBackground
      setData(newData)
    }
  }

  const handlePrint = async (): Promise<void> => {
    await setSelectedCell(null)
    window.print()
  }

  return (
    <div>
      <div className='no-print'>
        <div className='form-group input-group mb-2'>
          <label htmlFor='value' className='label'>
            القيمة
          </label>
          <input
            id='value'
            onChange={selectedCell !== null ? handleCellValueChange : undefined}
            value={
              selectedCell !== null
                ? data[selectedCell.r][selectedCell.c].value
                : undefined
            }
            ref={cellValueInpuRef}
            className='input'
            autoComplete='off'
            disabled={selectedCell === null}
          />
        </div>
        <div className='form-group mb-2'>
          <label htmlFor='col-span' className='label'>
            عرض الخلية
          </label>
          <select
            id='col-span'
            onChange={
              selectedCell !== null ? handleCellColSpanChange : undefined
            }
            value={
              selectedCell !== null
                ? data[selectedCell.r][selectedCell.c].colSpan
                : undefined
            }
            className='select'
            disabled={selectedCell === null}
          >
            {selectedCell !== null &&
              [...Array(COLUMNS - selectedCell.c).keys()].map(index => (
                <option key={index + 1} value={`${index + 1}`}>
                  {index + 1}
                </option>
              ))}
          </select>
        </div>
        <div className='form-group radio-group mb-2'>
          <label className='label'>لون الخلفية للخلية</label>
          <ColorPreview
            // text='شفاف'
            value='transparent'
            className='ml-2'
            disabled={selectedCell === null}
            selected={
              selectedCell !== null &&
              data[selectedCell.r][selectedCell.c].background === 'transparent'
            }
            updateCellBackground={updateCellBackground}
          />
          <ColorPreview
            // text='أزرق'
            value='#d7ecfb'
            className='ml-2'
            disabled={selectedCell === null}
            selected={
              selectedCell !== null &&
              data[selectedCell.r][selectedCell.c].background === '#d7ecfb'
            }
            updateCellBackground={updateCellBackground}
          />
          <ColorPreview
            // text='برتقالي'
            value='#edf1b6'
            className='ml-2'
            disabled={selectedCell === null}
            selected={
              selectedCell !== null &&
              data[selectedCell.r][selectedCell.c].background === '#edf1b6'
            }
            updateCellBackground={updateCellBackground}
          />
        </div>
      </div>
      <button
        className='button button-primary mb-2 no-print flex align-items-center'
        onClick={handlePrint}
      >
        <Print fill='#fff' width={20} style={{ marginLeft: '0.5rem' }} /> طباعة
      </button>
      <table>
        <thead>
          <tr>
            <th />
            <th />
            {[...Array(sections).keys()].map((s, index) => (
              <th key={index}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(ROWS).keys()].map((_, rowIndex) => {
            const dayIndex = rowIndex / periods
            const period = (rowIndex % periods) + 1

            return (
              <tr key={rowIndex}>
                {!!(rowIndex % periods === 0) && (
                  <td rowSpan={periods}>{ARABIC_DAYS[days[dayIndex]]}</td>
                )}
                <td>{period}</td>
                {[...Array(COLUMNS).keys()].map(
                  (s, columnIndex) =>
                    data[rowIndex][columnIndex].colSpan !== '0' && (
                      <td
                        key={columnIndex}
                        className={`editable-cell${
                          rowIndex === selectedCell?.r &&
                          columnIndex === selectedCell?.c
                            ? ' active-cell'
                            : ''
                        }`}
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                        colSpan={+data[rowIndex][columnIndex].colSpan}
                        data-col={columnIndex}
                        tabIndex={0}
                        style={{
                          backgroundColor:
                            data[rowIndex][columnIndex].background
                        }}
                      >
                        <div>{data[rowIndex][columnIndex].value}</div>
                      </td>
                    )
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
