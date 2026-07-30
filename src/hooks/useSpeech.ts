import { useCallback, useRef } from 'react'

/** Spoken race callouts via the browser Speech Synthesis API. */
export function useSpeech(muted: boolean) {
  const speaking = useRef(false)

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (muted || typeof window === 'undefined' || !window.speechSynthesis) return
      try {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = opts?.rate ?? 1.05
        utter.pitch = opts?.pitch ?? 1.1
        utter.onstart = () => {
          speaking.current = true
        }
        utter.onend = () => {
          speaking.current = false
        }
        utter.onerror = () => {
          speaking.current = false
        }
        window.speechSynthesis.speak(utter)
      } catch {
        // Speech may be unavailable; ignore quietly.
      }
    },
    [muted],
  )

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    speaking.current = false
  }, [])

  return { speak, stop }
}
