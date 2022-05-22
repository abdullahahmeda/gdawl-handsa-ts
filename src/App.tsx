import { ChangeEvent, FormEvent, ReactElement, useState } from 'react'
import { ARABIC_DAYS, DayOfWeek } from './constants'
import ArrowLeft from './icons/ArrowLeft'
import Timetable from './Timetable'

type Days = {
  [day in DayOfWeek]: boolean
}

type fields = 'periods' | 'sections' | 'checkedDays'

type Errors = {
  [key in fields]: string | null
}

function App (): ReactElement {
  const [periods, setPeriods] = useState('')
  const [sections, setSections] = useState('')

  const [errors, setErrors] = useState<Errors>({
    periods: null,
    sections: null,
    checkedDays: null
  })

  const [checkedDays, setCheckedDays] = useState<Days>({
    saturday: true,
    sunday: true,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: false
  })

  const [
    timetableComponent,
    setTimetableComponent
  ] = useState<ReactElement | null>(null)

  const _validate = (field: fields, value: string): void => {
    const newErrors = Object.assign({}, errors)
    if (field === 'periods') {
      if (value === '') newErrors.periods = 'حقل عدد الفترات إجباري.'
      else if (!/^[0-9]+$/.test(value)) {
        newErrors.periods = 'حقل عدد الفترات يجب أن يحتوي على أرقام فقط.'
      } else if (+value === 0) {
        newErrors.periods = 'حقل عدد الفترات يجب أن بكون 1 أو أكثر.'
      } else newErrors.periods = null
    } else if (field === 'sections') {
      if (value === '') newErrors.sections = 'حقل عدد السكاشن إجباري.'
      else if (!/^[0-9]+$/.test(value)) {
        newErrors.sections = 'حقل عدد السكاشن يجب أن يحتوي على أرقام فقط.'
      } else if (+value === 0) {
        newErrors.sections = 'حقل عدد السكاشن يجب أن بكون 1 أو أكثر.'
      } else newErrors.sections = null
    }
    setErrors(newErrors)
  }

  const handlePeriodsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPeriods(e.currentTarget.value)
    _validate('periods', e.currentTarget.value)
  }
  const handleSectionsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSections(e.currentTarget.value)
    _validate('sections', e.currentTarget.value)
  }

  const createTimetable = (): void => {
    const checkedDaysArray = Object.keys(ARABIC_DAYS).filter(
      day => checkedDays[day as keyof Days]
    )
    setTimetableComponent(
      <Timetable
        periods={parseInt(periods)}
        sections={parseInt(sections)}
        days={checkedDaysArray as DayOfWeek[]}
      />
    )
  }

  const handleDayToggle = (e: FormEvent<HTMLInputElement>): void => {
    setCheckedDays({
      ...checkedDays,
      [e.currentTarget.name]: e.currentTarget.checked
    })
  }

  const isButtonDisabled = (): boolean => {
    return (
      periods.length === 0 ||
      sections.length === 0 ||
      !Object.values(checkedDays).some(v => v)
    )
  }

  return (
    <div className='content'>
      <div className='container'>
        <div className='text-center'>
          {/* <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
            <path d='M448 32C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM224 256V160H64V256H224zM64 320V416H224V320H64zM288 416H448V320H288V416zM448 256V160H288V256H448z' />
          </svg> */}
          <h1 className='heading no-print'>جداول هندسة</h1>
          <p className='subtitle no-print'>
            موقع لعمل جداول كلية الهندسة (أو أي كلية أخرى)
          </p>
        </div>
        {timetableComponent === null && (
          <>
            <div className='mb-2'>
              <div className='form-group'>
                <label htmlFor='periods' className='label'>
                  عدد الفترات
                </label>
                <input
                  id='periods'
                  value={periods}
                  onChange={handlePeriodsChange}
                  autoComplete='off'
                  className='input'
                />
              </div>
              {errors.periods !== null && (
                <p className='error-text'>{errors.periods}</p>
              )}
            </div>
            <div className='mb-2'>
              <div className='form-group'>
                <label htmlFor='sections' className='label'>
                  عدد السكاشن
                </label>
                <input
                  id='sections'
                  value={sections}
                  onChange={handleSectionsChange}
                  autoComplete='off'
                  className='input'
                />
              </div>
              {errors.sections !== null && (
                <p className='error-text'>{errors.sections}</p>
              )}
            </div>
            <div className='mb-2'>
              <label className='label'>الأيام</label>
              <div className='options-wrapper'>
                {Object.keys(ARABIC_DAYS).map(enDay => (
                  <div key={enDay} className='option-group'>
                    <input
                      type='checkbox'
                      checked={checkedDays[enDay as keyof Days]}
                      onChange={handleDayToggle}
                      name={enDay}
                      id={enDay}
                    />
                    <label htmlFor={enDay}>
                      {ARABIC_DAYS[enDay as keyof typeof ARABIC_DAYS]}
                    </label>
                  </div>
                ))}
              </div>
              {errors.checkedDays !== null && <p>{errors.checkedDays}</p>}
            </div>

            <button
              onClick={createTimetable}
              disabled={isButtonDisabled()}
              className='button button-primary'
            >
              إنشاء الجدول
            </button>
          </>
        )}
        {timetableComponent !== null && (
          <div>
            {timetableComponent}
            <div className='flex justify-content-end'>
              <button
                onClick={() => setTimetableComponent(null)}
                className='button button-secondary mt-2 no-print flex align-items-center'
              >
                إنشاء جدول جديد{' '}
                <ArrowLeft
                  fill='#fff'
                  width={20}
                  style={{ marginRight: '0.5rem' }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
