/** 6:00 pm on Monday 30 November 2026, New Zealand daylight time (UTC+13). */
export const DADDY_VISIT = new Date('2026-11-30T18:00:00+13:00')

export const DADDY_VISIT_LABEL = 'Monday 30 November 2026 · 6:00 pm'

const NZ_TIME_ZONE = 'Pacific/Auckland'

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

/** Split the wait until `targetMs` into days, hours, minutes, and seconds. */
export function splitCountdown(targetMs: number, nowMs: number): CountdownParts {
  const remaining = Math.max(0, targetMs - nowMs)
  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return {
    days,
    hours,
    minutes,
    seconds,
    done: remaining < 1000,
  }
}

export function padCount(value: number) {
  return String(value).padStart(2, '0')
}

/** Fifteen nights, Sunday 15 November through Sunday 29 November. Earlier nights add extra plain pillows. */
export const SLEEP_ROW = 15

/** Calendar day in New Zealand, as a UTC day number so daylight saving cannot skew the count. */
function nzDayNumber(date: Date) {
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: NZ_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value)
  return Date.UTC(value('year'), value('month') - 1, value('day'))
}

/**
 * Nights still to come before Monday 30 November in New Zealand.
 * Sunday 15 November includes tonight through Sunday 29 November.
 * The count drops at New Zealand midnight, once that night is over.
 */
export function sleepsRemaining(now: Date, visit: Date) {
  const nights = Math.round((nzDayNumber(visit) - nzDayNumber(now)) / 86400000)
  return Math.max(0, nights)
}

/** What Carlos says when Lachlan taps him. */
export function sleepLine(nightsLeft: number, done: boolean) {
  if (done) return "It's time to see Daddy!"
  if (nightsLeft <= 0) return 'No more sleeps'
  if (nightsLeft === 1) return '1 more sleep'
  return `${nightsLeft} more sleeps`
}

/** True means that sleep is already over and shows a moon and a star. */
export function sleepPillowStates(daysLeft: number): boolean[] {
  const total = Math.max(SLEEP_ROW, daysLeft)
  const slept = total - daysLeft
  return Array.from({ length: total }, (_, index) => index < slept)
}
