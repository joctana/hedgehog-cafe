import './flight.css'

interface AirplaneProps {
  tilt?: number
}

export function Airplane({ tilt = 0 }: AirplaneProps) {
  return (
    <div
      className="flight-plane"
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 80" className="flight-plane-svg">
        <ellipse cx="96" cy="42" rx="62" ry="16" fill="#3b82f6" />
        <path d="M40 42c8-18 22-28 40-28h18c8 0 14 6 16 14l8 20H48c-6 0-10-2-8-6z" fill="#60a5fa" />
        <path d="M70 42l-28-22h18l28 22z" fill="#2563eb" />
        <path d="M70 42l-28 22h18l28-22z" fill="#1d4ed8" />
        <path d="M140 28h18l8 14h-20z" fill="#93c5fd" />
        <circle cx="128" cy="36" r="7" fill="#bfdbfe" />
        <circle cx="128" cy="36" r="3.5" fill="#1e3a8a" />
        <rect x="148" y="38" width="18" height="8" rx="3" fill="#fbbf24" />
        <ellipse cx="48" cy="42" rx="10" ry="6" fill="#1e40af" />
      </svg>
    </div>
  )
}
