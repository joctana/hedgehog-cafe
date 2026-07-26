import { useCallback, useRef } from 'react'

export type SoundKind = 'tap' | 'happy' | 'eat' | 'sleep' | 'celebrate' | 'wash' | 'bubble'

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.08,
) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.value = gainValue
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + duration)
}

export function useSounds(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const play = useCallback(
    (kind: SoundKind) => {
      if (muted) return
      try {
        const ctx = ensureCtx()
        switch (kind) {
          case 'tap':
            playTone(ctx, 520, 0.08, 'triangle', 0.06)
            break
          case 'eat':
            playTone(ctx, 320, 0.1, 'square', 0.04)
            playTone(ctx, 420, 0.12, 'sine', 0.05)
            break
          case 'happy':
            playTone(ctx, 660, 0.1, 'sine', 0.06)
            playTone(ctx, 880, 0.14, 'sine', 0.05)
            break
          case 'sleep':
            playTone(ctx, 280, 0.22, 'sine', 0.05)
            playTone(ctx, 220, 0.28, 'triangle', 0.04)
            break
          case 'wash':
            playTone(ctx, 480, 0.08, 'triangle', 0.05)
            playTone(ctx, 620, 0.1, 'sine', 0.04)
            break
          case 'bubble':
            playTone(ctx, 740, 0.09, 'sine', 0.04)
            playTone(ctx, 920, 0.1, 'triangle', 0.03)
            break
          case 'celebrate':
            playTone(ctx, 523, 0.12, 'sine', 0.07)
            playTone(ctx, 659, 0.14, 'sine', 0.06)
            playTone(ctx, 784, 0.18, 'sine', 0.06)
            break
        }
      } catch {
        // Audio may be blocked until a gesture; ignore quietly.
      }
    },
    [ensureCtx, muted],
  )

  return { play }
}
