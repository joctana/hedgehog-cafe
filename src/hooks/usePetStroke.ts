import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

interface StrokeOptions {
  onStrokeComplete: () => void
  minDistance?: number
}

export function usePetStroke({ onStrokeComplete, minDistance = 70 }: StrokeOptions) {
  const startX = useRef<number | null>(null)
  const traveled = useRef(0)
  const [stroking, setStroking] = useState(false)

  const onPointerDown = useCallback((event: ReactPointerEvent<Element>) => {
    startX.current = event.clientX
    traveled.current = 0
    setStroking(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<Element>) => {
      if (startX.current === null) return
      traveled.current += Math.abs(event.clientX - startX.current)
      startX.current = event.clientX
      if (traveled.current >= minDistance) {
        traveled.current = 0
        onStrokeComplete()
      }
    },
    [minDistance, onStrokeComplete],
  )

  const onPointerUp = useCallback(() => {
    startX.current = null
    traveled.current = 0
    setStroking(false)
  }, [])

  return {
    stroking,
    petHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}
