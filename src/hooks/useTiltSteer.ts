import { useCallback, useEffect, useRef, useState } from 'react'

export type TiltStatus = 'off' | 'on' | 'denied' | 'unavailable'

type Options = {
  /** When false, listeners are idle even if tilt is enabled. */
  active: boolean
  /** Called when relative tip maps to a different lane (0–2). */
  onLane: (lane: number) => void
}

const SMOOTH = 0.32
const CALIBRATE_MS = 500
/** Relative tip strength to leave / return to center (channel units). */
const ENTER_OUTER = 1.35
const RETURN_CENTER = 0.55

type Channels = {
  grav: number
  gamma: number
  beta: number
}

function screenAngle(): number {
  if (typeof screen !== 'undefined' && screen.orientation?.angle != null) {
    return screen.orientation.angle
  }
  if (typeof window !== 'undefined' && 'orientation' in window) {
    return Number((window as Window & { orientation?: number }).orientation) || 0
  }
  return 0
}

function gravityLateral(ag: DeviceMotionEventAcceleration): number | null {
  if (ag.x == null || ag.y == null) return null
  switch (screenAngle()) {
    case 90:
      return ag.y
    case -90:
    case 270:
      return -(ag.y ?? 0)
    case 180:
      return -(ag.x ?? 0)
    default:
      return ag.x
  }
}

function readOrientationChannels(e: DeviceOrientationEvent): Partial<Channels> {
  const out: Partial<Channels> = {}
  if (e.gamma != null) out.gamma = e.gamma / 8
  if (e.beta != null) out.beta = e.beta / 10
  return out
}

function laneFromOffset(offset: number, current: number): number {
  if (current === 0) {
    if (offset > -RETURN_CENTER) return offset >= ENTER_OUTER ? 2 : 1
    return 0
  }
  if (current === 2) {
    if (offset < RETURN_CENTER) return offset <= -ENTER_OUTER ? 0 : 1
    return 2
  }
  if (offset <= -ENTER_OUTER) return 0
  if (offset >= ENTER_OUTER) return 2
  return 1
}

function supportsMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window)
  )
}

async function requestMotionPermission(): Promise<boolean> {
  type Perm = () => Promise<'granted' | 'denied'>
  const motionPerm = (
    DeviceMotionEvent as unknown as { requestPermission?: Perm }
  ).requestPermission
  const orientPerm = (
    DeviceOrientationEvent as unknown as { requestPermission?: Perm }
  ).requestPermission

  try {
    if (typeof motionPerm === 'function') {
      return (await motionPerm()) === 'granted'
    }
    if (typeof orientPerm === 'function') {
      return (await orientPerm()) === 'granted'
    }
    return true
  } catch {
    return false
  }
}

function needsPermissionPrompt(): boolean {
  return (
    typeof (
      DeviceMotionEvent as unknown as { requestPermission?: unknown }
    ).requestPermission === 'function' ||
    typeof (
      DeviceOrientationEvent as unknown as { requestPermission?: unknown }
    ).requestPermission === 'function'
  )
}

export function useTiltSteer({ active, onLane }: Options) {
  const [status, setStatus] = useState<TiltStatus>(() =>
    supportsMotion() ? 'off' : 'unavailable',
  )
  const [tilt, setTilt] = useState(0)
  const [calibrating, setCalibrating] = useState(false)

  const smoothRef = useRef<Channels>({ grav: 0, gamma: 0, beta: 0 })
  const baselineRef = useRef<Channels>({ grav: 0, gamma: 0, beta: 0 })
  const sumRef = useRef<Channels>({ grav: 0, gamma: 0, beta: 0 })
  const countRef = useRef({ grav: 0, gamma: 0, beta: 0 })
  const laneRef = useRef(1)
  const onLaneRef = useRef(onLane)
  onLaneRef.current = onLane
  const enabledRef = useRef(false)
  const calibUntilRef = useRef(0)
  const calibActiveRef = useRef(false)
  const lastUiRef = useRef(0)
  /** Which channel currently drives steering (locked after leave-center). */
  const channelRef = useRef<keyof Channels | null>(null)

  const beginCalibrate = useCallback(() => {
    calibUntilRef.current = performance.now() + CALIBRATE_MS
    calibActiveRef.current = true
    sumRef.current = { grav: 0, gamma: 0, beta: 0 }
    countRef.current = { grav: 0, gamma: 0, beta: 0 }
    channelRef.current = null
    setCalibrating(true)
    setTilt(0)
  }, [])

  const disable = useCallback(() => {
    enabledRef.current = false
    setStatus((s) => (s === 'unavailable' ? s : 'off'))
    smoothRef.current = { grav: 0, gamma: 0, beta: 0 }
    setTilt(0)
    calibActiveRef.current = false
    setCalibrating(false)
    channelRef.current = null
  }, [])

  const enable = useCallback(async (): Promise<boolean> => {
    if (!supportsMotion()) {
      setStatus('unavailable')
      return false
    }

    if (needsPermissionPrompt()) {
      const ok = await requestMotionPermission()
      if (!ok) {
        enabledRef.current = false
        setStatus('denied')
        return false
      }
    }

    enabledRef.current = true
    setStatus('on')
    beginCalibrate()
    return true
  }, [beginCalibrate])

  const recenter = useCallback(() => {
    if (!enabledRef.current) return
    beginCalibrate()
  }, [beginCalibrate])

  useEffect(() => {
    if (status !== 'on' || !active) return

    beginCalibrate()

    const pickOffset = (): number => {
      const offsets = {
        grav: smoothRef.current.grav - baselineRef.current.grav,
        gamma: smoothRef.current.gamma - baselineRef.current.gamma,
        beta: smoothRef.current.beta - baselineRef.current.beta,
      }

      // Stick to a channel once the kid commits to a tip, so axes don't fight.
      if (channelRef.current) {
        const held = offsets[channelRef.current]
        if (Math.abs(held) >= RETURN_CENTER * 0.8) return held
        channelRef.current = null
      }

      let best: keyof Channels = 'gamma'
      let bestAbs = 0
      ;(['grav', 'gamma', 'beta'] as const).forEach((k) => {
        const a = Math.abs(offsets[k])
        if (a > bestAbs) {
          bestAbs = a
          best = k
        }
      })
      if (bestAbs >= ENTER_OUTER * 0.65) channelRef.current = best
      return offsets[best]
    }

    const afterSample = () => {
      if (!enabledRef.current) return
      const now = performance.now()

      if (calibActiveRef.current) {
        if (now < calibUntilRef.current) return
        const b: Channels = { grav: 0, gamma: 0, beta: 0 }
        ;(['grav', 'gamma', 'beta'] as const).forEach((k) => {
          const n = countRef.current[k]
          b[k] = n > 0 ? sumRef.current[k] / n : smoothRef.current[k]
        })
        baselineRef.current = b
        calibActiveRef.current = false
        setCalibrating(false)
      }

      const offset = pickOffset()
      if (now - lastUiRef.current > 40) {
        lastUiRef.current = now
        setTilt(offset)
      }
      const next = laneFromOffset(offset, laneRef.current)
      if (next !== laneRef.current) {
        laneRef.current = next
        onLaneRef.current(next)
      }
    }

    const onMotion = (e: DeviceMotionEvent) => {
      if (!enabledRef.current) return
      const ag = e.accelerationIncludingGravity
      if (!ag) return
      const lat = gravityLateral(ag)
      if (lat == null || Number.isNaN(lat)) return

      smoothRef.current.grav = smoothRef.current.grav * (1 - SMOOTH) + lat * SMOOTH

      if (calibActiveRef.current) {
        sumRef.current.grav += lat
        countRef.current.grav += 1
      }
      afterSample()
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      if (!enabledRef.current) return
      const ch = readOrientationChannels(e)
      ;(['gamma', 'beta'] as const).forEach((k) => {
        const v = ch[k]
        if (v == null || Number.isNaN(v)) return
        smoothRef.current[k] = smoothRef.current[k] * (1 - SMOOTH) + v * SMOOTH
        if (calibActiveRef.current) {
          sumRef.current[k] += v
          countRef.current[k] += 1
        }
      })
      afterSample()
    }

    window.addEventListener('devicemotion', onMotion, true)
    window.addEventListener('deviceorientation', onOrient, true)
    return () => {
      window.removeEventListener('devicemotion', onMotion, true)
      window.removeEventListener('deviceorientation', onOrient, true)
      channelRef.current = null
    }
  }, [status, active, beginCalibrate])

  const syncLane = useCallback((lane: number) => {
    laneRef.current = lane
  }, [])

  return { status, tilt, calibrating, enable, disable, recenter, syncLane }
}
