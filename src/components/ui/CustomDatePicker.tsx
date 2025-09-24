'use client'

import { useRef, useState, useEffect } from 'react'
import '@/app/custom-datepicker.css'

interface CustomDatePickerProps {
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  name?: string
  id?: string
  className?: string
  required?: boolean
}

export default function CustomDatePicker({
  value,
  onChange,
  min,
  max,
  name,
  id,
  className,
  required,
}: CustomDatePickerProps) {
  // References and state
  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const yearSelectorRef = useRef<HTMLDivElement>(null)

  const [showCalendar, setShowCalendar] = useState(false)
  const [showYearSelector, setShowYearSelector] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null,
  )

  // Min and max dates for validation
  const minDate = min ? new Date(min) : new Date('1900-01-01')
  const maxDate = max ? new Date(max) : new Date('2100-12-31')

  // Get year range for year selector
  const startYear = Math.max(minDate.getFullYear(), 1900)
  const endYear = Math.min(maxDate.getFullYear(), 2100)
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  ).reverse()

  // Get days in the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get days for the calendar display
  const getDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = getDaysInMonth(year, month)
    const daysInPrevMonth = getDaysInMonth(year, month - 1)

    const days = []

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year,
        isCurrentMonth: false,
      })
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      })
    }

    // Next month's days (to fill the grid)
    const remainingDays = 42 - days.length // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false,
      })
    }

    return days
  }

  // Check if a date is the same as the selected date
  const isSameDate = (
    date1: Date | null,
    date2: { day: number; month: number; year: number },
  ) => {
    if (!date1) return false
    return (
      date1.getFullYear() === date2.year &&
      date1.getMonth() === date2.month &&
      date1.getDate() === date2.day
    )
  }

  // Check if a date is today
  const isToday = (date: { day: number; month: number; year: number }) => {
    const today = new Date()
    return (
      today.getFullYear() === date.year &&
      today.getMonth() === date.month &&
      today.getDate() === date.day
    )
  }

  // Check if a date is selectable (within min/max range)
  const isSelectable = (date: { day: number; month: number; year: number }) => {
    const dateObj = new Date(date.year, date.month, date.day)
    return dateObj >= minDate && dateObj <= maxDate
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Select a year
  const selectYear = (year: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(year)
      return newDate
    })
    setShowYearSelector(false)
  }

  // Select a day
  const selectDay = (day: { day: number; month: number; year: number }) => {
    if (!isSelectable(day)) return

    const selectedDate = new Date(day.year, day.month, day.day)
    setSelectedDate(selectedDate)

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0]
    onChange(formattedDate)

    // Close the calendar
    setShowCalendar(false)
  }

  // Month names
  const months = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ]

  // Day names
  const weekdays = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']

  // Click outside handling to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowCalendar(false)
      }

      if (
        yearSelectorRef.current &&
        !yearSelectorRef.current.contains(event.target as Node)
      ) {
        setShowYearSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="custom-date-input-wrapper relative">
      {/* Native date input with modified calendar picker */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        name={name}
        id={id}
        className={className}
        required={required}
      />

      {/* Custom calendar button */}
      <button
        type="button"
        className="date-calendar-button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowCalendar(!showCalendar)
        }}
        aria-label="Open calendar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {/* Custom calendar popup */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="custom-calendar-popup"
          style={{ display: 'block' }}
        >
          {/* Calendar header */}
          <div className="calendar-header">
            {/* Year display (clickable) */}
            <div
              className="year-display"
              onClick={() => setShowYearSelector(!showYearSelector)}
            >
              {currentDate.getFullYear()}
            </div>

            {/* Month navigation */}
            <div className="month-navigation">
              <button
                type="button"
                className="nav-button"
                onClick={prevMonth}
                aria-label="Poprzedni miesiąc"
              >
                &lsaquo;
              </button>
              <div className="month-display">
                {months[currentDate.getMonth()]}
              </div>
              <button
                type="button"
                className="nav-button"
                onClick={nextMonth}
                aria-label="Następny miesiąc"
              >
                &rsaquo;
              </button>
            </div>
          </div>

          {/* Year selector */}
          {showYearSelector && (
            <div
              ref={yearSelectorRef}
              className="year-selector"
              style={{ display: 'block' }}
            >
              {years.map((year) => (
                <div
                  key={year}
                  className={`year-option ${year === currentDate.getFullYear() ? 'selected' : ''}`}
                  onClick={() => selectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          {/* Calendar grid */}
          <div className="calendar-grid">
            {/* Weekday headers */}
            {weekdays.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDays().map((day, index) => (
              <div
                key={`${day.year}-${day.month}-${day.day}-${index}`}
                className={`day ${day.isCurrentMonth ? '' : 'outside-month'} ${
                  isSameDate(selectedDate, day) ? 'selected' : ''
                } ${isToday(day) ? 'today' : ''}`}
                onClick={() => selectDay(day)}
                style={{
                  opacity: isSelectable(day) ? 1 : 0.3,
                  cursor: isSelectable(day) ? 'pointer' : 'not-allowed',
                }}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
