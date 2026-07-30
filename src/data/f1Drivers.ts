export type TeamId = 'apxgp' | 'ferrari' | 'redbull'

export interface F1Driver {
  id: string
  name: string
  team: TeamId
  teamName: string
  number: string
  primary: string
  secondary: string
  accent: string
}

export const F1_DRIVERS: F1Driver[] = [
  {
    id: 'sonny',
    name: 'Sonny Hayes',
    team: 'apxgp',
    teamName: 'APXGP',
    number: '99',
    primary: '#0d9488',
    secondary: '#111827',
    accent: '#f8fafc',
  },
  {
    id: 'joshua',
    name: 'Joshua Pearce',
    team: 'apxgp',
    teamName: 'APXGP',
    number: '18',
    primary: '#0d9488',
    secondary: '#111827',
    accent: '#f8fafc',
  },
  {
    id: 'lewis',
    name: 'Lewis Hamilton',
    team: 'ferrari',
    teamName: 'Ferrari',
    number: '44',
    primary: '#dc0000',
    secondary: '#fff200',
    accent: '#ffffff',
  },
  {
    id: 'max',
    name: 'Max Verstappen',
    team: 'redbull',
    teamName: 'Red Bull',
    number: '1',
    primary: '#1e3a8a',
    secondary: '#fbbf24',
    accent: '#ef4444',
  },
  {
    id: 'lachlan',
    name: 'Lachlan Beattie',
    team: 'apxgp',
    teamName: 'APXGP',
    number: '4',
    primary: '#0d9488',
    secondary: '#111827',
    accent: '#f8fafc',
  },
]

export const RIVAL_NAMES = ['Norris', 'Leclerc', 'Russell', 'Sainz', 'Piastri'] as const
