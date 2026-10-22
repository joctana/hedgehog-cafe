/** Noon on Monday 26 October 2026, using the device clock. Lachlan is counting down to Daddy. */
export const DADDY_VISIT = new Date(2026, 9, 26, 12, 0, 0, 0)

export const DADDY_VISIT_LABEL = 'Monday 26 October 2026 · 12:00 pm'

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

/** Five nights, Wednesday through Sunday, lead up to Monday. Earlier nights add extra plain pillows. */
export const SLEEP_ROW = 5

/**
 * Nights still to come before the visit morning.
 * Thursday includes Thursday night, Friday night, Saturday night, and Sunday night.
 * The count drops at local midnight, once that night is over.
 */
export function sleepsRemaining(now: Date, visit: Date) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const visitDay = Date.UTC(visit.getFullYear(), visit.getMonth(), visit.getDate())
  const nights = Math.round((visitDay - today) / 86400000)
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
