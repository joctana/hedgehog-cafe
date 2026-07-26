export type DecorItem = 'bow' | 'hat' | 'pillow'

export type HedgehogId = 'momo' | 'sora' | 'yuzu' | 'kiko'

export interface HedgehogProfile {
  id: HedgehogId
  name: string
  body: string
  belly: string
  spines: string
  nose: string
  cushion: string
  personality: string
}

export const HEDGEHOGS: HedgehogProfile[] = [
  {
    id: 'momo',
    name: 'Momo',
    body: '#5c3d2e',
    belly: '#f0c4a0',
    spines: '#3d2818',
    nose: '#2b1a12',
    cushion: '#f2a7a0',
    personality: 'loves apple slices',
  },
  {
    id: 'sora',
    name: 'Sora',
    body: '#6b5b4a',
    belly: '#efe0c8',
    spines: '#4a3b2c',
    nose: '#2b1a12',
    cushion: '#9ec9d4',
    personality: 'loves gentle pets',
  },
  {
    id: 'yuzu',
    name: 'Yuzu',
    body: '#8a6a3d',
    belly: '#ffe4b0',
    spines: '#6a4e28',
    nose: '#3a2418',
    cushion: '#e6b85c',
    personality: 'loves soft brushes',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    body: '#4e3a2f',
    belly: '#e8b896',
    spines: '#2f2118',
    nose: '#1c120c',
    cushion: '#6f9b6a',
    personality: 'loves cozy naps',
  },
]

export const DECOR_UNLOCK_ORDER: DecorItem[] = ['bow', 'hat', 'pillow']

export const DECOR_EMOJI: Record<DecorItem, string> = {
  bow: '🎀',
  hat: '🎩',
  pillow: '🛏️',
}

export const MAX_HAPPINESS = 5
