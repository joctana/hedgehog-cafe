export type BlueyId = 'bluey' | 'bingo' | 'bandit' | 'chilli' | 'muffin'

export interface BlueyCharacter {
  id: BlueyId
  name: string
  role: string
  /** Main coat */
  coat: string
  /** Darker patches / ears */
  patch: string
  /** Belly / muzzle */
  cream: string
  /** Nose */
  nose: string
  /** Accent for UI card */
  accent: string
}

export const BLUEY_CHARACTERS: BlueyCharacter[] = [
  {
    id: 'bluey',
    name: 'Bluey',
    role: 'Big sister',
    coat: '#7eb8d9',
    patch: '#4a8fb8',
    cream: '#f3e6cf',
    nose: '#3a2a22',
    accent: '#5aa0c8',
  },
  {
    id: 'bingo',
    name: 'Bingo',
    role: 'Little sister',
    coat: '#e9a15c',
    patch: '#c4783a',
    cream: '#f7e7d2',
    nose: '#3a2a22',
    accent: '#e08a3c',
  },
  {
    id: 'bandit',
    name: 'Bandit',
    role: 'Dad',
    coat: '#6b91a6',
    patch: '#3f6578',
    cream: '#efe2cd',
    nose: '#2f241e',
    accent: '#4f7a90',
  },
  {
    id: 'chilli',
    name: 'Chilli',
    role: 'Mum',
    coat: '#c45c3a',
    patch: '#8f3d26',
    cream: '#f4e4d0',
    nose: '#2f241e',
    accent: '#b04a2e',
  },
  {
    id: 'muffin',
    name: 'Muffin',
    role: 'Cousin',
    coat: '#f0d6a0',
    patch: '#c9a06e',
    cream: '#fff6ea',
    nose: '#3a2a22',
    accent: '#d4b06a',
  },
]
