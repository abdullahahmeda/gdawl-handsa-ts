import { ReactElement } from 'react'

interface Props {
  // text: string
  value: string
  updateCellBackground: (background: string) => void
  className?: string
  selected?: boolean
  disabled?: boolean
}

export default function ColorPreview ({
  // text,
  value,
  className,
  updateCellBackground,
  selected = false,
  disabled = false
}: Props): ReactElement {
  const handleChange = (): void => {
    updateCellBackground(value)
  }

  return (
    <div
      className={`inline-block radio-warpper ${
        className === undefined ? '' : className
      }`}
    >
      <input
        type='radio'
        id={`${value}-bg`}
        className='not-visible position-absolute'
        value={value}
        onChange={handleChange}
        name='bg-color'
      />
      <label
        className={`inline-block color-preview ${selected ? 'selected' : ''} ${
          disabled ? '' : 'cursor-pointer'
        } ml-2`}
        style={{ backgroundColor: disabled ? '#ddd' : value }}
        htmlFor={`${value}-bg`}
      />
      {/* <label
        htmlFor={`${value}-bg`}
        style={{ color: disabled ? '#727272' : 'initial' }}
      >
        {text}
      </label> */}
    </div>
  )
}
