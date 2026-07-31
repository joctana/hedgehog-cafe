import { useCallback, useEffect, useRef, useState } from 'react'

export type TiltStatus = 'off' | 'on' | 'denied' | 'unavailable'

type Options = {
  /** When false, orientation listeners are idle even if tilt is enabled. */
  active: boolean
  /** Called when smoothed tilt maps to a different lane (0–2). */
  onLane: (lane: number) => void
}

const SMOOTH = 0.18
const ENTER_OUTER = 12 // degrees to leave center lane
const RETURN_CENTER = 5 // hysteresis back to center

function screenAngle(): number {
  if (typeof screen !== 'undefined' && screen.orientation?.angle != null) {
    return screen.orientation.angle
  }
  if (typeof window !== 'undefined' && 'orientation' in window) {
    return Number((window as Window & { orientation?: number }).orientation) || 0
  }
  return 0
}

/** Left/right tilt in degrees; negative = lean left. */
function steerDegrees(e: DeviceOrientationEvent): number | null {
  if (e.beta == null && e.gamma == null) return null
  const angle = screenAngle()
  // Landscape: beta is the left/right axis for a table-held / lap-held iPad
  if (angle === 90) return -(e.beta ?? 0)
  if (angle === -90 || angle === 270) return e.beta ?? 0
  // Portrait: gamma is left/right
  return e.gamma ?? 0
}

function degreesToLane(deg: number, current: number): number {
  if (current === 0) {
    if (deg > -RETURN_CENTER) return deg >= ENTER_OUTER ? 2 : 1
    return 0
  }
  if (current === 2) {
    if (deg < RETURN_CENTER) return deg <= -ENTER_OUTER ? 0 : 1
    return 2
  }
  if (deg <= -ENTER_OUTER) return 0
  if (deg >= ENTER_OUTER) return 2
  return 1
}

function supportsOrientation(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
}

export function useTiltSteer({ active, onLane }: Options) {
  const [status, setStatus] = useState<TiltStatus>(() =>
    supportsOrientation() ? 'off' : 'unavailable',
  )
  const [tilt, setTilt] = useState(0)
  const smoothRef = useRef(0)
  const laneRef = useRef(1)
  const onLaneRef = useRef(onLane)
  onLaneRef.current = onLane
  const enabledRef = useRef(false)

  const disable = useCallback(() => {
    enabledRef.current = false
    setStatus((s) => (s === 'unavailable' ? s : 'off'))
    smoothRef.current = 0
    setTilt(0)
  }, [])

  const enable = useCallback(async (): Promise<boolean> => {
    if (!supportsOrientation()) {
      setStatus('unavailable')
      return false
    }

    try {
      // iOS Safari exposes requestPermission on the constructor.
      const requestPermission = (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>
        }
      ).requestPermission

      if (typeof requestPermission === 'function') {
        const result = await requestPermission()
        if (result !== 'granted') {
          enabledRef.current = false
          setStatus('denied')
          return false
        }
      }
      enabledRef.current = true
      setStatus('on')
      return true
    } catch {
      enabledRef.current = false
      setStatus('denied')
      return false
    }
  }, [])

  useEffect(() => {
    if (status !== 'on' || !active) return

    const onOrient = (e: DeviceOrientationEvent) => {
      if (!enabledRef.current) return
      const raw = steerDegrees(e)
      if (raw == null || Number.isNaN(raw)) return

      smoothRef.current = smoothRef.current * (1 - SMOOTH) + raw * SMOOTH
      const smoothed = smoothRef.current
      setTilt(smoothed)

      const nextLane = degreesToLane(smoothed, laneRef.current)
      if (nextLane !== laneRef.current) {
        laneRef.current = nextLane
        onLaneRef.current(nextLane)
      }
    }

    window.addEventListener('deviceorientation', onOrient, true)
    return () => window.removeEventListener('deviceorientation', onOrient, true)
  }, [status, active])

  /** Keep internal lane in sync when buttons move the car. */
  const syncLane = useCallback((lane: number) => {
    laneRef.current = lane
  }, [])

  return { status, tilt, enable, disable, syncLane }
}
