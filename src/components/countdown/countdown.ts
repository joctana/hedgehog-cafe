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

/** Five sleeps run up to noon on the 26th. Earlier days add extra plain pillows. */
export const SLEEP_ROW = 5

/** True means that sleep is already over and shows a moon and a star. */
export function sleepPillowStates(daysLeft: number): boolean[] {
  const total = Math.max(SLEEP_ROW, daysLeft)
  const slept = total - daysLeft
  return Array.from({ length: total }, (_, index) => index < slept)
}
